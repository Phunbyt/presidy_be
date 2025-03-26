import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  NotContains,
} from 'class-validator';

export class SendSupportMessageDto {
  @IsNotEmpty({ message: 'message  can not be empty' })
  public message: string;

  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  public email: string;
}

export class SendNewFamilyPromptDto {
  @IsNotEmpty({ message: 'planName can not be empty' })
  public planName: string;

  @IsNotEmpty({ message: 'planName can not be empty' })
  public familyId: string;

  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  public email: string;
}
