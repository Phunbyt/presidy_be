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
  async create(createPaystackHookDto: any) { // Intialize payment
    try {
      const { data, event } = createPaystackHookDto;

      console.log({ data, event });
      console.log('{ data, event }......');

      const { metadata } = data;

      console.log(metadata);
      console.log('metadata.....');

      if (event === 'charge.success') {
       

        const existingTransaction = await this.transactionModel.findOne({
          txRef:data.reference,
        })

        if(existingTransaction){
          console.log(`This transaction ${data.reference} has already been processed`)
          return 'Duplicate event, already processed'
        }

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
         await this.planService.joinPlan(
          metadata.userId,
          metadata.planId,
          metadata.email,
        );
      }

        else if(event === 'paymentrequest.success'){
           const existingTransaction = await this.transactionModel.findOne({
          txRef:data.reference,
        })

        if(existingTransaction){
          console.log(`This transaction ${data.reference} has already been processed`)
          return 'Duplicate event, already processed'
        }

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
         await this.planService.joinPlan(
          metadata.userId,
          metadata.planId,
          metadata.email,
        );
       }
       else if(event === 'paymentrequest.pending'){
      
       }       
else if (event === 'subscription.create') {
    const existingTransaction = await this.transactionModel.findOne({
        txRef: data.reference,
    });

    if (existingTransaction) {
        console.log(`This transaction ${data.reference} has already been processed`);
        return 'Duplicate event, already processed';
    }

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

    await this.planService.handleSubscriptionCreated(
        metadata.userId,
        metadata.planId,
        metadata.email,
    );
}

else if (event === 'subscription.disable') {
    const existingTransaction = await this.transactionModel.findOne({
        txRef: data.reference,
    });

    if (existingTransaction) {
        console.log(`This transaction ${data.reference} has already been processed`);
        return 'Duplicate event, already processed';
    }

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

    await this.planService.handleSubscriptionDisabled(
        metadata.userId,
        metadata.planId,
        metadata.email,
    );
}
    else if (event === 'subscription.expiring_cards') {
        await this.planService.handleCardExpiring(
            metadata.userId,
            metadata.planId,
            metadata.email,
        );
    }

else if (event === 'subscription.not_renew') {
    const existingTransaction = await this.transactionModel.findOne({
        txRef: data.reference,
    });

    if (existingTransaction) {
        console.log(`This transaction ${data.reference} has already been processed`);
        return 'Duplicate event, already processed';
    }

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

    await this.planService.handleSubscriptionNotRenewing(
        metadata.userId,
        metadata.planId,
        metadata.email,
    );
}

else if (event === 'invoice.create') {
    await this.planService.handleUpcomingInvoice(
        metadata.userId,
        metadata.planId,
        metadata.email,
    );
}

else if (event === 'invoice.payment_failed') {
    const existingTransaction = await this.transactionModel.findOne({
        txRef: data.reference,
    });

    if (existingTransaction) {
        console.log(`This transaction ${data.reference} has already been processed`);
        return 'Duplicate event, already processed';
    }

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

    await this.planService.handlePaymentFailed(
        metadata.userId,
        metadata.planId,
        metadata.email,
    );
}
else if (event === 'invoice.update') {
    const existingTransaction = await this.transactionModel.findOne({
        txRef: data.reference,
    });

    if (existingTransaction) {
        console.log(`This transaction ${data.reference} has already been processed`);
        return 'Duplicate event, already processed';
    }

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

    }
    
     catch (error) {
      console.log(error);
      console.log('error........createPaystackHookDto');
    }
    
   
    return 'This action adds a new paystackHook';
  }
}
