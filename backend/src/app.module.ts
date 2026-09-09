import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoadmapsModule } from './roadmaps/roadmaps.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ProgressModule } from './progress/progress.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    UsersModule,
    RoadmapsModule,
    EnrollmentsModule,
    ProgressModule,
    SubmissionsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
