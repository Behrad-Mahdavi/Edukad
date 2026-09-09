import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'شماره موبایل الزامی است' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'رمز عبور الزامی است' })
  @IsString()
  password: string;
}
