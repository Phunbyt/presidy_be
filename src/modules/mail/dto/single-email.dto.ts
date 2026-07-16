import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SingleEmailDto{
    @IsEmail()
    @IsNotEmpty()
    email!:string

    @IsString()
    @IsNotEmpty()
    subject!:string;

    @IsString()
    @IsNotEmpty()
    message!:string

    @IsString()
    @IsOptional()
    firstName?:string
}