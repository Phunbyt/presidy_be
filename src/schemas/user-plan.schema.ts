import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Plan } from './plan.schema';

@Schema({ timestamps: true })
export class UserPlan {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop({ type: [Types.ObjectId], ref: 'Plan' })
  public planIds: Plan[];
}

export type UserPlanDocument = HydratedDocument<UserPlan>;

export const UserPlanSchema = SchemaFactory.createForClass(UserPlan);
