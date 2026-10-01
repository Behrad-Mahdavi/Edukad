import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

const userCache = new Map<string, { user: any; expiresAt: number }>();
const CACHE_TTL_MS = 60_000; // 60 seconds TTL

export function invalidateUserAuthCache(userId?: string) {
  if (userId) {
    userCache.delete(userId);
  } else {
    userCache.clear();
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'edukad_super_secret_jwt_key_2026_rokad',
    });
  }

  async validate(payload: { sub: string; phone: string; role: string }) {
    const now = Date.now();
    const cached = userCache.get(payload.sub);
    if (cached && cached.expiresAt > now) {
      return cached.user;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
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

    if (!user) {
      throw new UnauthorizedException('کاربر یافت نشد یا دسترسی منقضی شده است');
    }

    userCache.set(payload.sub, { user, expiresAt: now + CACHE_TTL_MS });
    return user;
  }
}
