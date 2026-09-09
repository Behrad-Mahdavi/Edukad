import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Department, Role } from '@prisma/client';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private supabaseService: SupabaseService,
    private prisma: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      // 1. Try Supabase Auth verification
      const supabaseUser = await this.supabaseService.verifyToken(token);
      if (supabaseUser && supabaseUser.email) {
        // Find or sync user in local database
        let user = await this.prisma.user.findFirst({
          where: {
            OR: [
              { email: supabaseUser.email },
              { id: supabaseUser.id },
            ],
          },
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
          // Auto-sync new Supabase user into database
          const metadata = supabaseUser.user_metadata || {};
          const roleVal = (metadata.role as Role) || Role.STUDENT;
          const deptVal = (metadata.department as Department) || Department.ENGINEERS;
          const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);

          user = await this.prisma.user.create({
            data: {
              fullName: metadata.fullName || supabaseUser.email.split('@')[0],
              email: supabaseUser.email,
              phone: metadata.phone || `+989${randomSuffix}`,
              role: roleVal,
              department: deptVal,
              passwordHash: '',
            },
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
        }

        request.user = user;
        return true;
      }
    }

    // 2. Fallback to standard Passport JWT strategy
    try {
      const result = (await super.canActivate(context)) as boolean;
      return result;
    } catch {
      throw new UnauthorizedException('احراز هویت انجام نشد. لطفاً مجدداً وارد شوید.');
    }
  }
}
