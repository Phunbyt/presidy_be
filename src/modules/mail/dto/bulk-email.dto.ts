import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class BulkEmailDto{
    @IsNotEmpty()
    @IsString()
    subject!:string;

    @IsNotEmpty()
    @IsString()
    message!:string

    // @IsBoolean()
    // @IsOptional()
    // sendToAll!:boolean;

    // @IsArray() Coming back to this. So that admin can send emails to the amount of users that she wants to
    // @IsOptional()
    // userIds!:string[]

    // @IsString()
    // @IsNotEmpty()
    // segment!:string

    @IsArray()
    @ArrayMinSize(1)
    userIds!: string[]


}