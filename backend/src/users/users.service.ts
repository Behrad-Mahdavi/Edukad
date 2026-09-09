import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, Department, NotificationType } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: Role, department?: Department) {
    const where: any = {};
    if (role) where.role = role;
    if (department) where.department = department;

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        phone: true,
        username: true,
        email: true,
        role: true,
        level: true,
        department: true,
        createdAt: true,
        _count: {
          select: {
            studentEnrollments: true,
            mentoredEnrollments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        studentEnrollments: {
          include: {
            roadmap: true,
            mentor: {
              select: { id: true, fullName: true, phone: true },
            },
          },
        },
        mentoredEnrollments: {
          include: {
            roadmap: true,
            student: {
              select: { id: true, fullName: true, level: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        fullName: true,
        phone: true,
        username: true,
        email: true,
        role: true,
        level: true,
        department: true,
      },
    });

    // If level or role promoted, notify user
    if (updateUserDto.level && updateUserDto.level !== existing.level) {
      await this.prisma.notification.create({
        data: {
          userId: id,
          type: NotificationType.LEVEL_PROMOTED,
          title: 'ارتقای سطح مهارتی 🎖️',
          message: `سطح مهارتی شما توسط مدیر سیستم به «${updateUserDto.level}» ارتقا یافت. تبریک!`,
          link: '/profile',
          relatedEntityId: id,
          relatedEntityType: 'User',
        },
      });
    }

    return updated;
  }
}
