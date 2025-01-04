import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/enums';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { UserType } from 'src/common/constants/types';
import { Public } from 'src/common/decorators/public.decorator';
import { PlanDisputeDto, SupportMessageDto } from './dto/plan-dispute.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // @Roles(Role.Admin)
  @Public()
  @Post('create')
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @Get('user')
  findAll(@GetCurrentUser() user: UserType) {
    return this.planService.findAll(user);
  }

  @Get('all')
  findAllAvailablePlans(@GetCurrentUser() user: UserType) {
    return this.planService.findAllAvailablePlans(user);
  }

  @Post('subscribe')
  subscribeToPlan(@GetCurrentUser() user: UserType, @Body() planId: string) {
    return this.planService.subscribeToPlan(user, planId);
  }

  @Get('transactions')
  planTransactions(@GetCurrentUser() user: UserType) {
    return this.planService.planTransactions(user);
  }

  @Post('dispute')
  planDispute(
    @GetCurrentUser() user: UserType,
    @Body() planDisputeDto: PlanDisputeDto,
  ) {
    return this.planService.planDispute(user, planDisputeDto);
  }

  @Post('message')
  supportMessage(
    @GetCurrentUser() user: UserType,
    @Body() supportMessageDto: SupportMessageDto,
  ) {
    return this.planService.supportMessage(user, supportMessageDto);
  }

  // TODO: Add opt out endpoint
}
