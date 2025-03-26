import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  NotContains,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsNotFraudEmail } from 'src/common/helpers/validators.helper';

export class SignUpDto {
  @Length(2, 50, { message: 'Invalid first name length' })
  @IsNotEmpty({ message: 'First name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid first name' })
  @Transform((param) => param.value.toLowerCase().trim())
  public firstName: string;

  @Length(2, 50, { message: 'Invalid last name length' })
  @IsNotEmpty({ message: 'Last name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid last name' })
  @Transform((param) => param.value.toLowerCase().trim())
  public lastName: string;

  @Length(2, 2, { message: 'Invalid country length' })
  @IsNotEmpty({ message: 'country can not be empty' })
  @Transform((param) => param.value.toLowerCase().trim())
  public country: string;

  @Length(3, 50, { message: 'Invalid Username length' })
  @IsNotEmpty({ message: 'Username can not be empty' })
  @Transform((param) => param.value.toLowerCase().trim())
  public username: string;

  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  @Transform((param) => param.value.toLowerCase().trim())
  @IsNotFraudEmail()
  public email: string;

  @IsNotEmpty({ message: 'Password can not be empty' })
  @Length(8, 1000, { message: 'Password must be a minimum of 8 characters' })
  public password: string;
}

export class SignInDto {
  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  @Transform((param) => param.value.toLowerCase().trim())
  @IsNotFraudEmail()
  public email: string;

  @IsNotEmpty({ message: 'Password can not be empty' })
  @Length(8, 1000, { message: 'Password must be a minimum of 8 characters' })
  public password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 50, { message: 'Invalid first name length' })
  @IsNotEmpty({ message: 'First name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid first name' })
  @Transform((param) => param.value.toLowerCase().trim())
  public firstName: string;

  @IsOptional()
  @Length(2, 50, { message: 'Invalid last name length' })
  @IsNotEmpty({ message: 'Last name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid last name' })
  @Transform((param) => param.value.toLowerCase().trim())
  public lastName: string;

  @IsOptional()
  @Length(3, 50, { message: 'Invalid Username length' })
  @IsNotEmpty({ message: 'Username can not be empty' })
  @Transform((param) => param.value.toLowerCase().trim())
  public username: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Password can not be empty' })
  @Length(8, 1000, { message: 'Password must be a minimum of 8 characters' })
  public password: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @Transform((param) => param.value.toLowerCase().trim())
  public email?: string;
}

export class VerifyOtpByEmailDto {
  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  @Transform((param) => param.value.toLowerCase().trim())
  public email: string;

  @IsNotEmpty({ message: 'OTP can not be empty' })
  public otp: string;

  @IsNotEmpty({ message: 'route can not be empty' })
  public route: string;
}
