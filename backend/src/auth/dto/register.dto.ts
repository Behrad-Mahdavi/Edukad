import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Department, Role } from '@prisma/client';

export class RegisterDto {
  @IsNotEmpty({ message: 'ایمیل الزامی است' })
  @IsEmail({}, { message: 'فرمت ایمیل نامعتبر است' })
  email: string;

  @IsNotEmpty({ message: 'رمز عبور الزامی است' })
  @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
  password: string;

  @IsNotEmpty({ message: 'نام و نام خانوادگی الزامی است' })
  @IsString()
  fullName: string;

  @IsOptional()
  @IsEnum(Department, { message: 'دپارتمان نامعتبر است' })
  department?: Department;

  @IsOptional()
  @IsEnum(Role, { message: 'نقش نامعتبر است' })
  role?: Role;

  @IsOptional()
  @IsString()
  phone?: string;
}
