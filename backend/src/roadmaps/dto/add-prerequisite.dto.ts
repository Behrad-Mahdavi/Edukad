import { IsNotEmpty, IsString } from 'class-validator';

export class AddPrerequisiteDto {
  @IsNotEmpty({ message: 'شناسه گره پیش‌نیاز الزامی است' })
  @IsString()
  prerequisiteNodeId: string;
}
