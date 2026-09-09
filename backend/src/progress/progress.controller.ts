import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('nodes/:nodeId/start')
  async startNode(
    @CurrentUser('id') userId: string,
    @Param('nodeId') nodeId: string,
  ) {
    return this.progressService.startNode(userId, nodeId);
  }

  @Post('nodes/:nodeId/complete-direct')
  async completeWithoutDeliverable(
    @CurrentUser('id') userId: string,
    @Param('nodeId') nodeId: string,
  ) {
    return this.progressService.completeWithoutDeliverable(userId, nodeId);
  }

  @Get('roadmaps/:roadmapId')
  async getStudentProgress(
    @CurrentUser('id') userId: string,
    @Param('roadmapId') roadmapId: string,
  ) {
    return this.progressService.getStudentProgress(userId, roadmapId);
  }
}
