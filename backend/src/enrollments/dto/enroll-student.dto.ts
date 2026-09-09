import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EnrollStudentDto {
  @IsNotEmpty({ message: 'شناسه دانش‌آموز الزامی است' })
  @IsString()
  studentId: string;

  @IsNotEmpty({ message: 'شناسه مسیر الزامی است' })
  @IsString()
  roadmapId: string;

  @IsOptional()
  @IsString()
  mentorId?: string;
}
