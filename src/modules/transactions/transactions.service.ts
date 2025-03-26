import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserType } from 'src/common/constants/types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  public async findAll(user: UserType) {
    const transactions = await this.transactionModel
      .find({
        user: user._id,
      })
      .populate('planId')
      .sort({ createdAt: -1 }); // Correct sorting syntax

    if (!transactions) {
      return [];
    }

    return transactions;
  }

  public async findOne(txRef: string, user: UserType) {
    const transaction = await this.transactionModel.findOne({
      txRef,
      user: user._id,
    });

    if (!transaction) {
      throw new NotFoundException('transaction not found');
    }

    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
