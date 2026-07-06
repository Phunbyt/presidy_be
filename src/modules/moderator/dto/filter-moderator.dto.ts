import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class ModeratorFilterDto{

    @IsOptional()
    @IsString()
    search?: string;
    
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isVerified?: boolean;
    
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
}