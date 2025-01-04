import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePlanDto {
  @IsNotEmpty({ message: 'Plan name can not be empty' })
  @Transform((param) => param.value.toLowerCase())
  public name: string;

  @IsNotEmpty({ message: 'price can not be empty' })
  @IsNumber({}, { message: 'price must be a number' })
  public price: number;

  @Length(2, 5, { message: 'Invalid currency length' })
  @IsNotEmpty({ message: 'currency can not be empty' })
  @Transform((param) => param.value.toLowerCase())
  public currency: string;

  @Length(2, 60, { message: 'Invalid country length' })
  @IsNotEmpty({ message: 'country can not be empty' })
  @Transform((param) => param.value.toLowerCase())
  public country: string;

  @IsNotEmpty({ message: 'logoUrl can not be empty' })
  public logoUrl: string;

  @IsNotEmpty({ message: 'planUrl can not be empty' })
  public planUrl: string;

  @IsNotEmpty({ message: 'planCode can not be empty' })
  public planCode: string;

  @IsNotEmpty({ message: 'specialEmail can not be empty' })
  public specialEmail: boolean;

  @IsNotEmpty({ message: 'familySize can not be empty' })
  public familySize: number;
}
