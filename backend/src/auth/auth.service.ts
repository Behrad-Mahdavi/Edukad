import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-]/g, '');
  if (cleaned.startsWith('0098')) {
    cleaned = '+98' + cleaned.slice(4);
  } else if (cleaned.startsWith('09')) {
    cleaned = '+98' + cleaned.slice(1);
  } else if (cleaned.startsWith('9') && cleaned.length === 10) {
    cleaned = '+98' + cleaned;
  }
  return cleaned;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, pass: string) {
    const normalizedPhone = normalizePhoneNumber(phone);
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { phone: phone },
          { username: phone },
        ],
      },
    });

    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.phone, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('شماره موبایل یا رمز عبور اشتباه است');
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
      department: user.department,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
      },
    });

    if (!user) {
      throw new UnauthorizedException('کاربر یافت نشد');
    }

    return user;
  }
}
