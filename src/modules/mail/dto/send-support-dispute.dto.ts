import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  NotContains,
} from 'class-validator';

export class SendSupportDisputeDto {
  @IsNotEmpty({ message: 'message  can not be empty' })
  public message: string;

  @IsNotEmpty({ message: 'planName  can not be empty' })
  public planName: string;

  @Length(2, 20, { message: 'Invalid name length' })
  @IsNotEmpty({ message: 'name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid name' })
  public name: string;

  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  public email: string;
}
