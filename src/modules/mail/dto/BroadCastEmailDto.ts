import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";

export class BroadcastEmailDto {
    @IsOptional()
    @IsArray()
    userIds?: string[]; // Optional: specific user IDs

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    @IsBoolean()
    sendToAll?: boolean; // Optional: send to all users
}