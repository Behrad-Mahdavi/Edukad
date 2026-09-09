import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { CreateNodeDto } from './dto/create-node.dto';
import { AddPrerequisiteDto } from './dto/add-prerequisite.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Department, RoadmapStatus, Role, ResourceType } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roadmaps')
export class RoadmapsController {
  constructor(private readonly roadmapsService: RoadmapsService) {}

  @Get()
  async findAll(
    @Query('department') department?: Department,
    @Query('status') status?: RoadmapStatus,
  ) {
    return this.roadmapsService.findAll(department, status);
  }

  @Get(':slug')
  async findBySlug(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.roadmapsService.findBySlug(slug, userId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post()
  async createRoadmap(@Body() dto: CreateRoadmapDto) {
    return this.roadmapsService.createRoadmap(dto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  async updateRoadmap(
    @Param('id') id: string,
    @Body() dto: Partial<CreateRoadmapDto>,
  ) {
    return this.roadmapsService.updateRoadmap(id, dto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('nodes')
  async createNode(@Body() dto: CreateNodeDto) {
    return this.roadmapsService.createNode(dto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch('nodes/:id')
  async updateNode(
    @Param('id') id: string,
    @Body() dto: Partial<CreateNodeDto>,
  ) {
    return this.roadmapsService.updateNode(id, dto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('nodes/:nodeId/prerequisites')
  async addPrerequisite(
    @Param('nodeId') nodeId: string,
    @Body() dto: AddPrerequisiteDto,
  ) {
    return this.roadmapsService.addPrerequisite(nodeId, dto.prerequisiteNodeId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete('nodes/:nodeId/prerequisites/:prereqId')
  async removePrerequisite(
    @Param('nodeId') nodeId: string,
    @Param('prereqId') prereqId: string,
  ) {
    return this.roadmapsService.removePrerequisite(nodeId, prereqId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('nodes/:nodeId/resources')
  async addResource(
    @Param('nodeId') nodeId: string,
    @Body() body: { title: string; type: ResourceType; content: string },
  ) {
    return this.roadmapsService.addResource(nodeId, body);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete('resources/:resourceId')
  async deleteResource(@Param('resourceId') resourceId: string) {
    return this.roadmapsService.deleteResource(resourceId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete('nodes/:id')
  async deleteNode(@Param('id') id: string) {
    return this.roadmapsService.deleteNode(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  async deleteRoadmap(@Param('id') id: string) {
    return this.roadmapsService.deleteRoadmap(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch('nodes/batch/positions')
  async updatePositions(
    @Body() body: { updates: { id: string; positionX: number; positionY: number }[] },
  ) {
    return this.roadmapsService.updatePositions(body.updates);
  }
}
