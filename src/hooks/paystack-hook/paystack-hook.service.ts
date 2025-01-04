import { Injectable } from '@nestjs/common';
import { CreatePaystackHookDto } from './dto/create-paystack-hook.dto';
import { UpdatePaystackHookDto } from './dto/update-paystack-hook.dto';
import { PlanService } from 'src/modules/plan/plan.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from 'src/schemas/transaction.schema';

@Injectable()
export class PaystackHookService {
  constructor(
    private planService: PlanService,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}
  async create(createPaystackHookDto: any) {
    try {
      const { data, event } = createPaystackHookDto;

      const { metadata } = data;

      if (event === 'charge.success') {
        await this.planService.joinPlan(
          metadata.userId,
          metadata.planId,
          metadata.email,
        );

        await this.transactionModel.create({
          user: new Types.ObjectId(metadata.userId),
          planId: new Types.ObjectId(metadata.planId),
          email: metadata.email,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
          channel: data.channel,
          txRef: data.reference,
        });
      }
    } catch (error) {
      console.log(error);
    }

    return 'This action adds a new paystackHook';
  }

  findAll() {
    return `This action returns all paystackHook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paystackHook`;
  }

  update(id: number, updatePaystackHookDto: UpdatePaystackHookDto) {
    return `This action updates a #${id} paystackHook`;
  }

  remove(id: number) {
    return `This action removes a #${id} paystackHook`;
  }
}
