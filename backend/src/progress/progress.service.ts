import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NodeProgressStatus, NotificationType } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async startNode(userId: string, nodeId: string) {
    const node = await this.prisma.node.findUnique({ where: { id: nodeId } });
    if (!node) {
      throw new NotFoundException('گره یافت نشد');
    }

    const progress = await this.prisma.nodeProgress.findUnique({
      where: {
        userId_nodeId: { userId, nodeId },
      },
    });

    if (!progress) {
      throw new BadRequestException('این گره برای شما هنوز در دسترس قرار نگرفته است');
    }

    if (progress.status === NodeProgressStatus.LOCKED) {
      throw new BadRequestException('این گره قفل است و پیش‌نیازهای آن تکمیل نشده است');
    }

    if (progress.status === NodeProgressStatus.UNLOCKED) {
      return this.prisma.nodeProgress.update({
        where: { id: progress.id },
        data: { status: NodeProgressStatus.IN_PROGRESS },
      });
    }

    return progress;
  }

  async completeWithoutDeliverable(userId: string, nodeId: string) {
    const node = await this.prisma.node.findUnique({
      where: { id: nodeId },
    });
    if (!node) {
      throw new NotFoundException('گره یافت نشد');
    }

    if (node.hasDeliverable) {
      throw new BadRequestException('این گره دارای تحویل کار است و باید مأموریت آن ثبت شود');
    }

    const progress = await this.prisma.nodeProgress.findUnique({
      where: {
        userId_nodeId: { userId, nodeId },
      },
    });

    if (!progress || (progress.status !== NodeProgressStatus.UNLOCKED && progress.status !== NodeProgressStatus.IN_PROGRESS)) {
      throw new BadRequestException('گره در وضعیت مناسب برای تکمیل مستقیم نیست');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.nodeProgress.update({
        where: { id: progress.id },
        data: { status: NodeProgressStatus.COMPLETED },
      });

      // Unlock downstream dependent nodes
      await this.unlockDownstreamNodes(tx, userId, nodeId);

      return updated;
    });
  }

  /**
   * Helper executed inside a transaction to unlock all downstream nodes
   * whose prerequisites are now all satisfied.
   */
  async unlockDownstreamNodes(tx: any, userId: string, completedNodeId: string) {
    // 1. Find all nodes that have completedNodeId as a prerequisite
    const dependentEdges = await tx.nodePrerequisite.findMany({
      where: { prerequisiteNodeId: completedNodeId },
      include: {
        node: true,
      },
    });

    for (const edge of dependentEdges) {
      const targetNode = edge.node;

      // Check current progress of targetNode
      const currentProgress = await tx.nodeProgress.findUnique({
        where: {
          userId_nodeId: {
            userId,
            nodeId: targetNode.id,
          },
        },
      });

      // If already unlocked or beyond, skip
      if (
        currentProgress &&
        currentProgress.status !== NodeProgressStatus.LOCKED
      ) {
        continue;
      }

      // 2. Fetch ALL prerequisites of targetNode
      const allPrereqs = await tx.nodePrerequisite.findMany({
        where: { nodeId: targetNode.id },
        select: { prerequisiteNodeId: true },
      });

      const prereqIds = allPrereqs.map((p: any) => p.prerequisiteNodeId);

      // 3. Count how many of these prerequisites are COMPLETED for this user
      const completedPrereqsCount = await tx.nodeProgress.count({
        where: {
          userId,
          nodeId: { in: prereqIds },
          status: NodeProgressStatus.COMPLETED,
        },
      });

      // 4. If ALL prerequisites are completed, transition targetNode to UNLOCKED
      if (completedPrereqsCount === prereqIds.length) {
        await tx.nodeProgress.upsert({
          where: {
            userId_nodeId: {
              userId,
              nodeId: targetNode.id,
            },
          },
          update: {
            status: NodeProgressStatus.UNLOCKED,
          },
          create: {
            userId,
            nodeId: targetNode.id,
            status: NodeProgressStatus.UNLOCKED,
          },
        });

        // Notify user of newly unlocked node
        await tx.notification.create({
          data: {
            userId,
            type: NotificationType.NODE_UNLOCKED,
            title: 'گره مهارتی جدید باز شد',
            message: `گره «${targetNode.title}» باز شد و می‌توانید مأموریت آن را شروع کنید.`,
            link: `/roadmaps`,
            relatedEntityId: targetNode.id,
            relatedEntityType: 'Node',
          },
        });
      }
    }
  }

  async getStudentProgress(userId: string, roadmapId: string) {
    return this.prisma.nodeProgress.findMany({
      where: {
        userId,
        node: { roadmapId },
      },
      include: {
        node: true,
        submissions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
