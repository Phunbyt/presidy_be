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

  @IsEmail({}, { message: 'Invalid moderatorEmail provided' })
  @NotContains('+', { message: 'Invalid moderatorEmail provided' })
  @IsNotEmpty({ message: 'moderatorEmail can not be empty' })
  public moderatorEmail: string;

  @IsNotEmpty({ message: 'familyLink  can not be empty' })
  public familyLink: string;

  @IsNotEmpty({ message: 'presidyLink  can not be empty' })
  public presidyLink: string;

  @IsNotEmpty({ message: 'planId  can not be empty' })
  public planId: string;

  @IsNotEmpty({ message: 'specialDetails  can not be empty' })
  public specialDetails: boolean;

  @IsNotEmpty({ message: 'moderatorDetails  can not be empty' })
  public moderatorDetails: boolean;

  @IsNotEmpty({ message: 'webDetails  can not be empty' })
  public webDetails: boolean;

  @IsNotEmpty({ message: 'planName  can not be empty' })
  public planName: string;

  @Length(2, 20, { message: 'Invalid name length' })
  @IsNotEmpty({ message: 'name can not be empty' })
  @Matches(/^[a-z\-]+$/, { message: 'Invalid name' })
  public name: string;
}
