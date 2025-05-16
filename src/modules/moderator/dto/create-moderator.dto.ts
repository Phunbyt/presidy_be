import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateModeratorDto {
  @IsNotEmpty({ message: 'firstName can not be empty' })
  public firstName: string;

  @IsNotEmpty({ message: 'lastName can not be empty' })
  public lastName: string;

  @IsNotEmpty({ message: 'phoneNumber can not be empty' })
  @IsNumber({}, { message: 'phoneNumber must be a number' })
  public phoneNumber: number;

  @IsNotEmpty({ message: 'accountNumber can not be empty' })
  @IsNumber({}, { message: 'accountNumber must be a number' })
  public accountNumber: number;

  @IsNotEmpty({ message: 'bankName can not be empty' })
  public bankName: string;
}
