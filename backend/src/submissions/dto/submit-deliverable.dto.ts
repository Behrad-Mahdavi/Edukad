import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class SubmitDeliverableDto {
  @IsNotEmpty({ message: 'شناسه گره الزامی است' })
  @IsString()
  nodeId: string;

  @IsNotEmpty({ message: 'لینک خروجی پروژه الزامی است' })
  @IsString()
  submissionUrl: string;

  @IsOptional()
  @IsString()
  submissionNote?: string;
}
