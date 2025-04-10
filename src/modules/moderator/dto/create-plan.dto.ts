import { IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty({ message: 'planId can not be empty' })
  public planId: string;

  @IsNotEmpty({ message: 'familyLink can not be empty' })
  public familyLink: string;
}
