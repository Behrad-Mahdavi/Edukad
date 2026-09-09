import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmitDeliverableDto } from './dto/submit-deliverable.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Roles(Role.STUDENT)
  @Post()
  async submitDeliverable(
    @CurrentUser('id') studentId: string,
    @Body() dto: SubmitDeliverableDto,
  ) {
    return this.submissionsService.submitDeliverable(studentId, dto);
  }

  @Roles(Role.MENTOR, Role.SUPER_ADMIN)
  @Get('queue')
  async getMentorReviewQueue(
    @CurrentUser('id') mentorId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.submissionsService.getMentorReviewQueue(mentorId, role);
  }

  @Roles(Role.MENTOR, Role.SUPER_ADMIN)
  @Get('dashboard')
  async getMentorDashboard(
    @CurrentUser('id') mentorId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.submissionsService.getMentorDashboard(mentorId, role);
  }

  @Roles(Role.MENTOR, Role.SUPER_ADMIN)
  @Post(':id/review')
  async reviewSubmission(
    @Param('id') submissionId: string,
    @CurrentUser('id') reviewerId: string,
    @Body() dto: ReviewSubmissionDto,
  ) {
    return this.submissionsService.reviewSubmission(submissionId, reviewerId, dto);
  }

  @Get('progress/:progressId/history')
  async getSubmissionHistory(@Param('progressId') progressId: string) {
    return this.submissionsService.getSubmissionHistory(progressId);
  }
}
