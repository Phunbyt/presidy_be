import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { CreateModeratorDto } from './dto/create-moderator.dto';
import { UpdateModeratorDto } from './dto/update-moderator.dto';
import { UserType } from 'src/common/constants/types';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('moderator')
export class ModeratorController {
  constructor(private readonly moderatorService: ModeratorService) {}

  @Post('register')
  create(
    @Body() createModeratorDto: CreateModeratorDto,
    @GetCurrentUser() user: UserType,
  ) {
    return this.moderatorService.create(createModeratorDto, user);
  }

  @Post('account')
  addBankAccount(
    @Body() createModeratorDto: CreateModeratorDto,
    @GetCurrentUser() user: UserType,
  ) {
    return this.moderatorService.addBankAccount(createModeratorDto, user);
  }

  @Post('plan')
  addPlan(
    @Body() createPlanDto: CreatePlanDto,
    @GetCurrentUser() user: UserType,
  ) {
    return this.moderatorService.addPlan(createPlanDto, user);
  }

  @Get('available-plans')
  getAvailablePlans(@GetCurrentUser() user: UserType) {
    return this.moderatorService.getAvailablePlans(user);
  }

  @Get('dashboard')
  getDashboardData(@GetCurrentUser() user: UserType) {
    return this.moderatorService.getDashboardData(user);
  }
}
