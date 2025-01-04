import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  NotContains,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @Length(2, 20, { message: 'Invalid first name length' })
  @IsNotEmpty({ message: 'First name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid first name' })
  @Transform((param) => param.value.toLowerCase())
  public firstName: string;

  @Length(2, 20, { message: 'Invalid last name length' })
  @IsNotEmpty({ message: 'Last name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid last name' })
  @Transform((param) => param.value.toLowerCase())
  public lastName: string;

  @Length(3, 20, { message: 'Invalid Username length' })
  @IsNotEmpty({ message: 'Username can not be empty' })
  @Transform((param) => param.value.toLowerCase())
  public username: string;

  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  @Transform((param) => param.value.toLowerCase())
  public email: string;

  @IsNotEmpty({ message: 'Password can not be empty' })
  @Length(8, 16, { message: 'Password must be a minimum of 8 characters' })
  public password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 20, { message: 'Invalid first name length' })
  @IsNotEmpty({ message: 'First name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid first name' })
  @Transform((param) => param.value.toLowerCase())
  public firstName: string;

  @IsOptional()
  @Length(2, 20, { message: 'Invalid last name length' })
  @IsNotEmpty({ message: 'Last name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid last name' })
  @Transform((param) => param.value.toLowerCase())
  public lastName: string;

  @IsOptional()
  @Length(3, 20, { message: 'Invalid Username length' })
  @IsNotEmpty({ message: 'Username can not be empty' })
  @Transform((param) => param.value.toLowerCase())
  public username: string;
}
