import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Public()
  @Post('create')
  create(@Body() createFamilyDto: CreateFamilyDto) {
    return this.familyService.create(createFamilyDto);
  }

  @Public()
  @Get(':familyUrlId')
  findOne(@Param('familyUrlId') familyUrlId: string) {
    return this.familyService.findOne(familyUrlId);
  }
}
