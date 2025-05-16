import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

import { ModeratorPlan } from './moderator-plan.schema';

@Schema({ timestamps: true })
export class ModeratorReceipt {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop({ type: Types.ObjectId, ref: 'ModeratorPlan' })
  public planId: ModeratorPlan;

  @Prop({ default: '' })
  public receiptLink: string;
}

export type ModeratorReceiptDocument = HydratedDocument<ModeratorReceipt>;

export const ModeratorReceiptSchema =
  SchemaFactory.createForClass(ModeratorReceipt);
