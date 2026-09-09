import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Department, Role } from '@prisma/client';

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
    private supabaseService: SupabaseService,
  ) {}

  async validateUser(identifier: string, pass: string) {
    // 1. Try email lookup
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    // 2. If not found, try phone lookup
    if (!user) {
      const normalizedPhone = normalizePhoneNumber(identifier);
      user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { phone: normalizedPhone },
            { phone: identifier },
          ],
        },
      });
    }

    // 3. If user found and password matches bcrypt
    if (user && user.passwordHash && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }

    // 4. Try Supabase Auth direct sign-in with email
    try {
      const { data: supaData, error: supaErr } =
        await this.supabaseService.anonClient.auth.signInWithPassword({
          email: identifier,
          password: pass,
        });

      if (!supaErr && supaData?.user) {
        // Sync or get from prisma
        if (!user) {
          const meta = supaData.user.user_metadata || {};
          const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
          user = await this.prisma.user.create({
            data: {
              id: supaData.user.id,
              fullName: meta.fullName || identifier.split('@')[0],
              email: identifier,
              phone: meta.phone || `+989${randomSuffix}`,
              role: (meta.role as Role) || Role.STUDENT,
              department: (meta.department as Department) || Department.ENGINEERS,
              passwordHash: await bcrypt.hash(pass, 10),
            },
          });
        }
        const { passwordHash, ...result } = user;
        return { ...result, supabaseSession: supaData.session };
      }
    } catch {
      // Supabase direct check failed, proceed to null
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const identifier = loginDto.email || loginDto.phone;
    if (!identifier) {
      throw new BadRequestException('ایمیل یا شماره موبایل الزامی است');
    }

    const userWithSession = await this.validateUser(identifier, loginDto.password);
    if (!userWithSession) {
      throw new UnauthorizedException('ایمیل/شماره موبایل یا رمز عبور اشتباه است');
    }

    const { supabaseSession, ...user } = userWithSession as any;

    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
    };

    const accessToken = supabaseSession?.access_token || this.jwtService.sign(payload);

    return {
      accessToken,
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, department = Department.ENGINEERS, role = Role.STUDENT, phone } = registerDto;

    // 1. Check if user already exists in DB
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existing) {
      throw new BadRequestException('کاربری با این مشخصات قبلاً ثبت شده است');
    }

    // 2. Create in Supabase Auth with email_confirm: true (No email confirmation needed!)
    let supabaseUser: any = null;
    try {
      supabaseUser = await this.supabaseService.createUserWithoutConfirmation({
        email,
        password,
        fullName,
        department,
        role,
        phone,
      });
    } catch (e: any) {
      // If user already exists in Supabase, proceed to link or throw
      if (!e.message?.includes('already registered')) {
        throw new BadRequestException(`خطا در ثبت‌نام سوپابیس: ${e.message}`);
      }
    }

    // 3. Create in local database
    const passwordHash = await bcrypt.hash(password, 10);
    const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
    const user = await this.prisma.user.create({
      data: {
        id: supabaseUser?.id, // Use supabase user ID if available
        email,
        fullName,
        phone: phone || `+989${randomSuffix}`,
        department,
        role,
        passwordHash,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        username: true,
        role: true,
        level: true,
        department: true,
      },
    });

    // 4. Sign in to Supabase to get real access token
    let accessToken: string;
    try {
      const loginRes = await this.supabaseService.anonClient.auth.signInWithPassword({
        email,
        password,
      });
      accessToken = loginRes.data.session?.access_token || this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        department: user.department,
      });
    } catch {
      accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        department: user.department,
      });
    }

    return {
      accessToken,
      user,
      message: 'ثبت‌نام با موفقیت انجام شد',
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
