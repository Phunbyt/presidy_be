import {
  IsEmail,
  NotContains,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';

export class SendFamilyLinkDto {
  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  public email: string;

  @IsNotEmpty({ message: 'familyLink  can not be empty' })
  public familyLink: string;

  @IsNotEmpty({ message: 'planName  can not be empty' })
  public planName: string;

  @Length(2, 20, { message: 'Invalid name length' })
  @IsNotEmpty({ message: 'name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid name' })
  public name: string;
}
