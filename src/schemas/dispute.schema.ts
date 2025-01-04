import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Plan } from './plan.schema';

@Schema({ timestamps: true })
export class Dispute {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop({ type: Types.ObjectId, ref: 'Plan' })
  public planId: Plan;

  @Prop()
  public dispute: string;
}

export type DisputeDocument = HydratedDocument<Dispute>;

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
