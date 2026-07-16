import { IsEmail, IsNotEmpty,IsString, } from "class-validator";

export class AdminAuthDto{

    @IsEmail()
    @IsNotEmpty()
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string

}


