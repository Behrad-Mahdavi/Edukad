import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import {
  NodeProgressStatus,
  EnrollmentStatus,
  NotificationType,
  Role,
} from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enrollStudent(dto: EnrollStudentDto) {
    const student = await this.prisma.user.findUnique({
      where: { id: dto.studentId },
    });
    if (!student || student.role !== Role.STUDENT) {
      throw new BadRequestException('کاربر انتخاب‌شده معتبر نیست یا دانش‌آموز نمی‌باشد');
    }

    const roadmap = await this.prisma.roadmap.findUnique({
      where: { id: dto.roadmapId },
      include: {
        nodes: {
          include: {
            prerequisites: true,
          },
        },
      },
    });
    if (!roadmap) {
      throw new NotFoundException('مسیر یادگیری یافت نشد');
    }

    if (dto.mentorId) {
      const mentor = await this.prisma.user.findUnique({
        where: { id: dto.mentorId },
      });
      if (!mentor || (mentor.role !== Role.MENTOR && mentor.role !== Role.SUPER_ADMIN)) {
        throw new BadRequestException('منتور انتخاب‌شده معتبر نمی‌باشد');
      }
    }

    const existingEnrollment = await this.prisma.userRoadmap.findUnique({
      where: {
        studentId_roadmapId: {
          studentId: dto.studentId,
          roadmapId: dto.roadmapId,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('این دانش‌آموز قبلاً در این مسیر ثبت‌نام شده است');
    }

    // Execute atomic transaction for enrollment + eager UNLOCKED creation for root nodes
    return this.prisma.$transaction(async (tx) => {
      const userRoadmap = await tx.userRoadmap.create({
        data: {
          studentId: dto.studentId,
          roadmapId: dto.roadmapId,
          mentorId: dto.mentorId,
          status: EnrollmentStatus.IN_PROGRESS,
          roadmapVersionAtEnrollment: roadmap.version,
        },
      });

      // Find all root nodes (nodes with 0 prerequisites in this roadmap)
      const rootNodes = roadmap.nodes.filter(
        (node) => node.prerequisites.length === 0,
      );

      for (const rootNode of rootNodes) {
        await tx.nodeProgress.upsert({
          where: {
            userId_nodeId: {
              userId: dto.studentId,
              nodeId: rootNode.id,
            },
          },
          update: {
            status: NodeProgressStatus.UNLOCKED,
          },
          create: {
            userId: dto.studentId,
            nodeId: rootNode.id,
            status: NodeProgressStatus.UNLOCKED,
          },
        });
      }

      // Notify student
      await tx.notification.create({
        data: {
          userId: dto.studentId,
          type: NotificationType.SYSTEM,
          title: 'ثبت‌نام در مسیر مهارتی جدید 🚀',
          message: `شما در مسیر «${roadmap.title}» ثبت‌نام شدید. گره‌های اولیه برای شما باز شدند!`,
          link: `/roadmaps/${roadmap.slug}`,
          relatedEntityId: userRoadmap.id,
          relatedEntityType: 'UserRoadmap',
        },
      });

      // Notify mentor if assigned
      if (dto.mentorId) {
        await tx.notification.create({
          data: {
            userId: dto.mentorId,
            type: NotificationType.SYSTEM,
            title: 'دانش‌آموز جدید تحت نظارت',
            message: `${student.fullName} به عنوان دانش‌آموز شما در مسیر «${roadmap.title}» اختصاص یافت.`,
            link: `/mentor`,
            relatedEntityId: userRoadmap.id,
            relatedEntityType: 'UserRoadmap',
          },
        });
      }

      return userRoadmap;
    });
  }

  async getMyEnrollments(studentId: string) {
    return this.prisma.userRoadmap.findMany({
      where: { studentId },
      include: {
        roadmap: {
          include: {
            nodes: {
              include: {
                progresses: {
                  where: { userId: studentId },
                },
              },
            },
          },
        },
        mentor: {
          select: { id: true, fullName: true, phone: true },
        },
      },
    });
  }

  async getAllEnrollments() {
    return this.prisma.userRoadmap.findMany({
      include: {
        student: {
          select: { id: true, fullName: true, phone: true, level: true },
        },
        roadmap: {
          select: { id: true, title: true, slug: true, department: true },
        },
        mentor: {
          select: { id: true, fullName: true, phone: true },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }
}
