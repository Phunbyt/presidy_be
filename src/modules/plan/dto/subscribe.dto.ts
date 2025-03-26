import { IsNotEmpty } from 'class-validator';

export class SubscribeDto {
  @IsNotEmpty({ message: 'planId can not be empty' })
  public planId: string;

  @IsNotEmpty({ message: 'dispute can not be empty' })
  public email: string;
}
