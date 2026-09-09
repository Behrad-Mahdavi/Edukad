import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { CreateNodeDto } from './dto/create-node.dto';
import { Department, RoadmapStatus } from '@prisma/client';

@Injectable()
export class RoadmapsService {
  constructor(private prisma: PrismaService) {}

  async findAll(department?: Department, status?: RoadmapStatus) {
    const where: any = {};
    if (department) where.department = department;
    if (status) where.status = status;

    return this.prisma.roadmap.findMany({
      where,
      include: {
        _count: {
          select: {
            nodes: true,
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string, userId?: string) {
    const roadmap = await this.prisma.roadmap.findUnique({
      where: { slug },
      include: {
        nodes: {
          include: {
            resources: true,
            prerequisites: {
              select: {
                prerequisiteNodeId: true,
              },
            },
            dependentOnMe: {
              select: {
                nodeId: true,
              },
            },
            progresses: userId
              ? {
                  where: { userId },
                  include: {
                    submissions: {
                      orderBy: { createdAt: 'desc' },
                    },
                  },
                }
              : false,
          },
        },
        enrollments: userId
          ? {
              where: { studentId: userId },
              include: {
                mentor: {
                  select: { id: true, fullName: true, phone: true },
                },
              },
            }
          : false,
      },
    });

    if (!roadmap) {
      throw new NotFoundException('مسیر یادگیری مورد نظر یافت نشد');
    }

    return roadmap;
  }

  async findById(id: string) {
    const roadmap = await this.prisma.roadmap.findUnique({
      where: { id },
      include: {
        nodes: {
          include: {
            resources: true,
            prerequisites: true,
          },
        },
      },
    });

    if (!roadmap) {
      throw new NotFoundException('مسیر یادگیری یافت نشد');
    }

    return roadmap;
  }

  async createRoadmap(dto: CreateRoadmapDto) {
    const existing = await this.prisma.roadmap.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException('نامک (Slug) قبلاً استفاده شده است');
    }

    return this.prisma.roadmap.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        department: dto.department,
        status: dto.status || RoadmapStatus.DRAFT,
        version: 1,
      },
    });
  }

  async updateRoadmap(id: string, data: Partial<CreateRoadmapDto>) {
    return this.prisma.roadmap.update({
      where: { id },
      data,
    });
  }

  async createNode(dto: CreateNodeDto) {
    return this.prisma.$transaction(async (tx) => {
      const node = await tx.node.create({
        data: {
          roadmapId: dto.roadmapId,
          title: dto.title,
          description: dto.description,
          positionX: dto.positionX,
          positionY: dto.positionY,
          hasDeliverable: dto.hasDeliverable ?? true,
        },
      });

      // Increment roadmap version on structural edit
      await tx.roadmap.update({
        where: { id: dto.roadmapId },
        data: { version: { increment: 1 } },
      });

      return node;
    });
  }

  async updateNode(id: string, data: Partial<CreateNodeDto>) {
    return this.prisma.node.update({
      where: { id },
      data,
    });
  }

  /**
   * Check if adding edge (nodeId depends on prerequisiteNodeId) forms a cycle.
   * If there already exists a path from prerequisiteNodeId backwards to nodeId,
   * then adding nodeId -> prerequisiteNodeId would create a cycle!
   */
  async checkCycle(nodeId: string, prerequisiteNodeId: string): Promise<boolean> {
    if (nodeId === prerequisiteNodeId) {
      return true;
    }

    const visited = new Set<string>();
    const stack: string[] = [prerequisiteNodeId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === nodeId) {
        return true;
      }

      if (!visited.has(current)) {
        visited.add(current);

        // Find all prerequisites of `current`
        const prereqs = await this.prisma.nodePrerequisite.findMany({
          where: { nodeId: current },
          select: { prerequisiteNodeId: true },
        });

        for (const p of prereqs) {
          if (!visited.has(p.prerequisiteNodeId)) {
            stack.push(p.prerequisiteNodeId);
          }
        }
      }
    }

    return false;
  }

  async addPrerequisite(nodeId: string, prerequisiteNodeId: string) {
    if (nodeId === prerequisiteNodeId) {
      throw new BadRequestException('یک گره نمی‌تواند پیش‌نیاز خودش باشد');
    }

    // Verify both nodes exist and belong to the same roadmap
    const [targetNode, prereqNode] = await Promise.all([
      this.prisma.node.findUnique({ where: { id: nodeId } }),
      this.prisma.node.findUnique({ where: { id: prerequisiteNodeId } }),
    ]);

    if (!targetNode || !prereqNode) {
      throw new NotFoundException('گره یا گره پیش‌نیاز یافت نشد');
    }

    if (targetNode.roadmapId !== prereqNode.roadmapId) {
      throw new BadRequestException('هر دو گره باید متعلق به یک مسیر باشند');
    }

    return this.prisma.$transaction(async (tx) => {
      // Check for existing duplicate
      const existing = await tx.nodePrerequisite.findUnique({
        where: {
          nodeId_prerequisiteNodeId: {
            nodeId,
            prerequisiteNodeId,
          },
        },
      });

      if (existing) {
        throw new BadRequestException('این رابطه پیش‌نیاز از قبل ثبت شده است');
      }

      // Mandatory Server-side DFS Cycle Detection inside transaction
      const hasCycle = await this.checkCycle(nodeId, prerequisiteNodeId);
      if (hasCycle) {
        throw new BadRequestException(
          'خطای وابستگی چرخه‌ای: افزودن این پیش‌نیاز باعث ایجاد حلقه (Cycle) در گراف می‌شود',
        );
      }

      const relation = await tx.nodePrerequisite.create({
        data: {
          nodeId,
          prerequisiteNodeId,
        },
      });

      // Structural edit increments roadmap version
      await tx.roadmap.update({
        where: { id: targetNode.roadmapId },
        data: { version: { increment: 1 } },
      });

      return relation;
    });
  }

  async removePrerequisite(nodeId: string, prerequisiteNodeId: string) {
    return this.prisma.$transaction(async (tx) => {
      const deleted = await tx.nodePrerequisite.delete({
        where: {
          nodeId_prerequisiteNodeId: {
            nodeId,
            prerequisiteNodeId,
          },
        },
      });

      const node = await tx.node.findUnique({ where: { id: nodeId } });
      if (node) {
        await tx.roadmap.update({
          where: { id: node.roadmapId },
          data: { version: { increment: 1 } },
        });
      }

      return deleted;
    });
  }

  async addResource(nodeId: string, data: { title: string; type: any; content: string }) {
    return this.prisma.resource.create({
      data: {
        nodeId,
        title: data.title,
        type: data.type,
        content: data.content,
      },
    });
  }

  async deleteResource(resourceId: string) {
    return this.prisma.resource.delete({
      where: { id: resourceId },
    });
  }

  async deleteNode(id: string) {
    const node = await this.prisma.node.findUnique({ where: { id } });
    if (!node) {
      throw new NotFoundException('گره یافت نشد');
    }

    return this.prisma.$transaction(async (tx) => {
      const deleted = await tx.node.delete({ where: { id } });
      await tx.roadmap.update({
        where: { id: node.roadmapId },
        data: { version: { increment: 1 } },
      });
      return deleted;
    });
  }

  async deleteRoadmap(id: string) {
    const roadmap = await this.prisma.roadmap.findUnique({ where: { id } });
    if (!roadmap) {
      throw new NotFoundException('مسیر یادگیری یافت نشد');
    }
    return this.prisma.roadmap.delete({ where: { id } });
  }

  async updatePositions(updates: { id: string; positionX: number; positionY: number }[]) {
    return this.prisma.$transaction(
      updates.map((u) =>
        this.prisma.node.update({
          where: { id: u.id },
          data: { positionX: u.positionX, positionY: u.positionY },
        }),
      ),
    );
  }
}
