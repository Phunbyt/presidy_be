import {
  IsEmail,
  NotContains,
  IsNotEmpty,
  Length,
  IsNumberString,
  Matches,
} from 'class-validator';

export class SendOTPMailDto {
  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  public email: string;

  @Length(4, 4, { message: 'Invalid otp length' })
  @IsNotEmpty({ message: 'OTP  can not be empty' })
  @IsNumberString({}, { message: 'OTP can not contain letters' })
  public otp: string;

  @Length(2, 20, { message: 'Invalid name length' })
  @IsNotEmpty({ message: 'name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid name' })
  public name: string;
}
