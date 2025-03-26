import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, NotContains } from 'class-validator';
import { IsNotFraudEmail } from 'src/common/helpers/validators.helper';

export class PlanDisputeDto {
  @IsNotEmpty({ message: 'planId can not be empty' })
  public planId: string;

  @IsNotEmpty({ message: 'dispute can not be empty' })
  public dispute: string;
}

export class SupportMessageDto {
  @IsNotEmpty({ message: 'message can not be empty' })
  public message: string;

  @IsEmail({}, { message: 'Invalid email provided' })
  @NotContains('+', { message: 'Invalid email provided' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  @Transform((param) => param.value.toLowerCase().trim())
  @IsNotFraudEmail()
  public email: string;
}
