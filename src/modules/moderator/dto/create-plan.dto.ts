import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty({ message: 'planId can not be empty' })
  public planId: string;

  @IsOptional()
  @IsNotEmpty({ message: 'familyLink can not be empty.' })
  public familyLink?: string;

  // @IsNotEmpty({ message: 'moderatorDetails can not be empty' })
  public moderatorDetails?: string;

  // @IsNotEmpty({ message: 'moderatorAvailability can not be empty' })
  public moderatorAvailability?: string;

  // @IsNotEmpty({ message: 'webDetails can not be empty' })
  public webDetails?: boolean;

  @IsOptional()
  // @IsNotEmpty({ message: 'webDetailsData can not be empty' })
  public webDetailsData?: string;
}
