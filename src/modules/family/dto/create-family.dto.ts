import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFamilyDto {
  @IsNotEmpty({ message: 'planId can not be empty' })
  public planId: string;

  @IsNotEmpty({ message: 'familyLink can not be empty..' })
  public familyLink: string;

  @IsNotEmpty({ message: 'familyMembersLimit can not be empty' })
  @IsNumber({}, { message: 'familyMembersLimit must be a number' })
  public familyMembersLimit: number;
}
