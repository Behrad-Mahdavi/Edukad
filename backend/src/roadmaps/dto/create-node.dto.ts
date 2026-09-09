import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNodeDto {
  @IsNotEmpty({ message: 'شناسه مسیر الزامی است' })
  @IsString()
  roadmapId: string;

  @IsNotEmpty({ message: 'عنوان گره الزامی است' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'توضیحات گره الزامی است' })
  @IsString()
  description: string;

  @IsNumber()
  positionX: number;

  @IsNumber()
  positionY: number;

  @IsOptional()
  @IsBoolean()
  hasDeliverable?: boolean;
}
