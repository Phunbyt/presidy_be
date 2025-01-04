import { IsNotEmpty, IsNumber, Length } from 'class-validator';

export class PlanDisputeDto {
  @IsNotEmpty({ message: 'planId can not be empty' })
  public planId: string;

  @IsNotEmpty({ message: 'dispute can not be empty' })
  public dispute: string;
}

export class SupportMessageDto {
  @IsNotEmpty({ message: 'message can not be empty' })
  public message: string;
}
