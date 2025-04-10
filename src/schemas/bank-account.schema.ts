import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Plan } from './plan.schema';

@Schema({ timestamps: true })
export class BankAccount {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop()
  public firstName: string;

  @Prop()
  public lastName: string;

  @Prop()
  public accountNumber: number;

  @Prop()
  public bankName: string;
}

export type BankAccountDocument = HydratedDocument<BankAccount>;

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);
