import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Department, RoadmapStatus } from '@prisma/client';

export class CreateRoadmapDto {
  @IsNotEmpty({ message: 'عنوان مسیر الزامی است' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'نامک (Slug) الزامی است' })
  @IsString()
  slug: string;

  @IsNotEmpty({ message: 'توضیحات مسیر الزامی است' })
  @IsString()
  description: string;

  @IsEnum(Department, { message: 'دپارتمان نامعتبر است' })
  department: Department;

  @IsOptional()
  @IsEnum(RoadmapStatus)
  status?: RoadmapStatus;
}
