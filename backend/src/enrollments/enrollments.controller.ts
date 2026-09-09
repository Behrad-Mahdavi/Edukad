import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Roles(Role.SUPER_ADMIN)
  @Post()
  async enrollStudent(@Body() dto: EnrollStudentDto) {
    return this.enrollmentsService.enrollStudent(dto);
  }

  @Get('my')
  async getMyEnrollments(@CurrentUser('id') studentId: string) {
    return this.enrollmentsService.getMyEnrollments(studentId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get()
  async getAllEnrollments() {
    return this.enrollmentsService.getAllEnrollments();
  }
}
