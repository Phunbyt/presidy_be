import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserType } from 'src/common/constants/types';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@GetCurrentUser() user: UserType) {
    return this.transactionsService.findAll(user);
  }

  @Get('single')
  findOne(
    @Query() query: Record<string, string>,
    @GetCurrentUser() user: UserType,
  ) {
    const { txRef } = query;

    return this.transactionsService.findOne(txRef, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
