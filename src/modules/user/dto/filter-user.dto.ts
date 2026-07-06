import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type, Transform } from "class-transformer";

export class FilterUserDto {
    @IsOptional()
    @IsString()
    search?: string;

    // @IsOptional()
    // @IsBoolean()
    // @Type(() => Boolean)
    // isVerified?: boolean;

    @IsString()
    @IsOptional()
    status!:string

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isModerator?: boolean;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isOffline?: boolean;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 20;

    @IsOptional()
@IsString()
planId?: string;

@IsOptional()
@IsString()
moderatorId?: string;
}