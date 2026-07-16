import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOfflineUserDto {
    @IsNotEmpty({ message: 'First name is required' })
    @IsString()
    public firstName: string;

    @IsNotEmpty({ message: 'Last name is required' })
    @IsString()
    public lastName: string;

    @IsEmail({}, { message: 'Invalid email provided' })
    @IsNotEmpty({ message: 'Email is required' })
    public email: string;

    @IsNotEmpty({ message: 'Phone number is required' })
    @IsString()
    public phoneNumber: string;

    @IsNotEmpty({ message: 'Moderator is required' })
    @IsString()
    public moderatorId: string;

    @IsOptional()
    @IsString()
    public subscriptionDuration?: string;
}