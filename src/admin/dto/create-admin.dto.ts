 import {IsEmail, IsNotEmpty, IsOptional, Matches} from 'class-validator'
export class CreateAdminDto {
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.',
    },
  )
  password: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  roleId: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  profile: string;

  @IsNotEmpty()
  status: boolean;

  createdBy?: string;
  updatedBy?: string;
}
export class LoginAdminDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.',
    },
  )
  password: string;
}
export class VerifyForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  otp: number;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.',
    },
  )
  password: string;
}
export class ForgotPassword {
    @IsNotEmpty()
    email: string;
}