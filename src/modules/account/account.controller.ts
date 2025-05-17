import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Get('banks')
  findAllBanks() {
    return this.accountService.findAllBanks();
  }

  @Public()
  @Get('validate/:bankCode/:accountNumber')
  validateAccount(
    @Param('bankCode') bankCode: string,
    @Param('accountNumber') accountNumber: string,
  ) {
    return this.accountService.validateAccount(bankCode, accountNumber);
  }
}
