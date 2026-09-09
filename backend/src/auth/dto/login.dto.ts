import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty({ message: 'رمز عبور الزامی است' })
  @IsString()
  password: string;
}
