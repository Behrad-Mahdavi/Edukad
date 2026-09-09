import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressService } from '../progress/progress.service';
import { SubmitDeliverableDto } from './dto/submit-deliverable.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import {
  NodeProgressStatus,
  SubmissionOutcome,
  NotificationType,
  Role,
} from '@prisma/client';

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    private progressService: ProgressService,
  ) {}

  async submitDeliverable(studentId: string, dto: SubmitDeliverableDto) {
    const node = await this.prisma.node.findUnique({
      where: { id: dto.nodeId },
      include: { roadmap: true },
    });

    if (!node) {
      throw new NotFoundException('گره یافت نشد');
    }

    if (!node.hasDeliverable) {
      throw new BadRequestException('این گره فاقد مأموریت ارسالی است و نیازی به ارسال ندارد');
    }

    // Check or initialize NodeProgress
    let progress = await this.prisma.nodeProgress.findUnique({
      where: {
        userId_nodeId: {
          userId: studentId,
          nodeId: dto.nodeId,
        },
      },
    });

    if (!progress) {
      throw new BadRequestException('شما هنوز به این گره دسترسی ندارید');
    }

    if (
      progress.status === NodeProgressStatus.LOCKED ||
      progress.status === NodeProgressStatus.COMPLETED
    ) {
      throw new BadRequestException(
        progress.status === NodeProgressStatus.LOCKED
          ? 'این گره قفل است'
          : 'این گره قبلاً با موفقیت تکمیل شده است',
      );
    }

    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    // Find mentor assigned to this student on this roadmap
    const enrollment = await this.prisma.userRoadmap.findUnique({
      where: {
        studentId_roadmapId: {
          studentId,
          roadmapId: node.roadmapId,
        },
      },
      include: { mentor: true },
    });

    return this.prisma.$transaction(async (tx) => {
      // 1. Create new immutable NodeSubmission record
      const submission = await tx.nodeSubmission.create({
        data: {
          nodeProgressId: progress.id,
          submissionUrl: dto.submissionUrl,
          submissionNote: dto.submissionNote,
          outcome: SubmissionOutcome.PENDING,
        },
      });

      // 2. Update NodeProgress status to SUBMITTED and point to latest submission
      await tx.nodeProgress.update({
        where: { id: progress.id },
        data: {
          status: NodeProgressStatus.SUBMITTED,
          currentSubmissionId: submission.id,
        },
      });

      // 3. Notify mentor if assigned
      if (enrollment?.mentorId) {
        await tx.notification.create({
          data: {
            userId: enrollment.mentorId,
            type: NotificationType.NEW_SUBMISSION_FOR_REVIEW,
            title: 'تحویل کار جدید برای بازبینی',
            message: `${student?.fullName || 'دانش‌آموز'} مأموریت گره «${node.title}» در مسیر «${node.roadmap.title}» را ارسال کرد.`,
            link: '/mentor',
            relatedEntityId: submission.id,
            relatedEntityType: 'NodeSubmission',
          },
        });
      }

      return submission;
    });
  }

  async getMentorReviewQueue(mentorId: string, role: Role) {
    const whereCondition: any = {
      outcome: SubmissionOutcome.PENDING,
    };

    // If not super admin, only show submissions for students mentored by this mentor
    if (role !== Role.SUPER_ADMIN) {
      whereCondition.nodeProgress = {
        node: {
          roadmap: {
            enrollments: {
              some: {
                mentorId,
              },
            },
          },
        },
      };
    }

    return this.prisma.nodeSubmission.findMany({
      where: whereCondition,
      include: {
        nodeProgress: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                phone: true,
                level: true,
                department: true,
              },
            },
            node: {
              include: {
                roadmap: {
                  select: { id: true, title: true, slug: true, department: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async reviewSubmission(
    submissionId: string,
    reviewerId: string,
    dto: ReviewSubmissionDto,
  ) {
    const submission = await this.prisma.nodeSubmission.findUnique({
      where: { id: submissionId },
      include: {
        nodeProgress: {
          include: {
            node: {
              include: { roadmap: true },
            },
            user: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('تحویل کار یافت نشد');
    }

    if (submission.outcome !== SubmissionOutcome.PENDING) {
      throw new BadRequestException('این تحویل کار قبلاً بررسی شده است');
    }

    const { nodeProgress } = submission;
    const studentId = nodeProgress.userId;
    const nodeId = nodeProgress.nodeId;
    const nodeTitle = nodeProgress.node.title;

    return this.prisma.$transaction(async (tx) => {
      // 1. Update submission
      const updatedSubmission = await tx.nodeSubmission.update({
        where: { id: submissionId },
        data: {
          outcome: dto.outcome,
          mentorFeedback: dto.mentorFeedback,
          reviewedById: reviewerId,
          reviewedAt: new Date(),
        },
      });

      if (dto.outcome === SubmissionOutcome.APPROVED) {
        // 2a. Update progress to COMPLETED
        await tx.nodeProgress.update({
          where: { id: nodeProgress.id },
          data: { status: NodeProgressStatus.COMPLETED },
        });

        // 3a. Transactional cascade unlock of downstream dependent nodes
        await this.progressService.unlockDownstreamNodes(tx, studentId, nodeId);

        // 4a. Notify student of approval
        await tx.notification.create({
          data: {
            userId: studentId,
            type: NotificationType.MENTOR_FEEDBACK,
            title: 'مأموریت شما تایید شد! 🎉',
            message: `مأموریت گره «${nodeTitle}» با موفقیت تایید شد.${dto.mentorFeedback ? ' یادداشت منتور: ' + dto.mentorFeedback : ''}`,
            link: `/roadmaps/${nodeProgress.node.roadmap.slug}`,
            relatedEntityId: submission.id,
            relatedEntityType: 'NodeSubmission',
          },
        });
      } else if (dto.outcome === SubmissionOutcome.REJECTED) {
        // 2b. Update progress to NEEDS_REVISION
        await tx.nodeProgress.update({
          where: { id: nodeProgress.id },
          data: { status: NodeProgressStatus.NEEDS_REVISION },
        });

        // 4b. Notify student of revision
        await tx.notification.create({
          data: {
            userId: studentId,
            type: NotificationType.MENTOR_FEEDBACK,
            title: 'مأموریت نیاز به بازبینی دارد 🔄',
            message: `مأموریت گره «${nodeTitle}» نیاز به اصلاح دارد. بازخورد منتور: ${dto.mentorFeedback || 'لطفاً توضیحات را بررسی و مجدداً ارسال کنید.'}`,
            link: `/roadmaps/${nodeProgress.node.roadmap.slug}`,
            relatedEntityId: submission.id,
            relatedEntityType: 'NodeSubmission',
          },
        });
      }

      return updatedSubmission;
    });
  }

  async getSubmissionHistory(progressId: string) {
    return this.prisma.nodeSubmission.findMany({
      where: { nodeProgressId: progressId },
      include: {
        reviewedBy: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMentorDashboard(mentorId: string, role: Role) {
    // Find all students mentored by this mentor
    const enrollments = await this.prisma.userRoadmap.findMany({
      where: role === Role.SUPER_ADMIN ? {} : { mentorId },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            level: true,
            department: true,
          },
        },
        roadmap: {
          include: {
            nodes: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });

    const studentCards = await Promise.all(
      enrollments.map(async (enr) => {
        const totalNodes = enr.roadmap.nodes.length;

        const progresses = await this.prisma.nodeProgress.findMany({
          where: {
            userId: enr.studentId,
            nodeId: { in: enr.roadmap.nodes.map((n) => n.id) },
          },
          include: { node: true },
        });

        const completedCount = progresses.filter(
          (p) => p.status === NodeProgressStatus.COMPLETED,
        ).length;

        const progressPercent = totalNodes > 0
          ? Math.round((completedCount / totalNodes) * 100)
          : 0;

        // Bottleneck: active node that is SUBMITTED, NEEDS_REVISION, or IN_PROGRESS
        const bottleneck =
          progresses.find((p) => p.status === NodeProgressStatus.NEEDS_REVISION) ||
          progresses.find((p) => p.status === NodeProgressStatus.SUBMITTED) ||
          progresses.find((p) => p.status === NodeProgressStatus.IN_PROGRESS) ||
          progresses.find((p) => p.status === NodeProgressStatus.UNLOCKED);

        return {
          enrollmentId: enr.id,
          student: enr.student,
          roadmap: {
            id: enr.roadmap.id,
            title: enr.roadmap.title,
            slug: enr.roadmap.slug,
            department: enr.roadmap.department,
          },
          totalNodes,
          completedCount,
          progressPercent,
          bottleneckNode: bottleneck ? bottleneck.node.title : 'همه تکمیل شده',
          bottleneckStatus: bottleneck ? bottleneck.status : 'COMPLETED',
        };
      }),
    );

    return studentCards;
  }
}
