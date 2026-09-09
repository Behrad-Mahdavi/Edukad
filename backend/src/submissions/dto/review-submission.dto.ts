import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SubmissionOutcome } from '@prisma/client';

export class ReviewSubmissionDto {
  @IsEnum(SubmissionOutcome, { message: 'نتیجه ارزیابی باید APPROVED یا REJECTED باشد' })
  outcome: SubmissionOutcome;

  @IsOptional()
  @IsString()
  mentorFeedback?: string;
}
