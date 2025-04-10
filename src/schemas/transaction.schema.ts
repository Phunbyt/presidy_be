import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Plan } from './plan.schema';

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop({ type: Types.ObjectId, ref: 'Plan' })
  public planId: Plan;

  @Prop({ required: true })
  public status: string;

  @Prop({ required: true })
  public email: string;

  @Prop({ required: true })
  public txRef: string;

  @Prop({ required: true })
  public currency: string;

  @Prop({ required: true })
  public channel: string;

  @Prop({ required: true })
  public amount: string;

  @Prop({ default: false })
  public isModerator: boolean;
}

export type TransactionDocument = HydratedDocument<Transaction>;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
