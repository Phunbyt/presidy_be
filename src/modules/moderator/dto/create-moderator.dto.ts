import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateModeratorDto {
  @IsNotEmpty({ message: 'firstName can not be empty' })
  public firstName: string;

  @IsNotEmpty({ message: 'lastName can not be empty' })
  public lastName: string;

  @IsNotEmpty({ message: 'phoneNumber can not be empty' })
  @IsString()
  @Length(11,11, {message:'The phone number must be eleven digits'}) // The phone number has been updated to string in this line
  public phoneNumber: string;

  @IsNotEmpty({ message: 'accountNumber can not be empty' })
  public accountNumber: string;

  @IsNotEmpty({ message: 'bankName can not be empty' })
  public bankName: string;
}