import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Plan } from './plan.schema';

@Schema({ timestamps: true })
export class ModeratorPlan {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  public users: User[];

  @Prop({ type: Types.ObjectId, ref: 'Plan' })
  public planId: Plan;

  @Prop({ default: '' })
  public familyLink: string;

  @Prop()
  public familyMembersLimit: number;

  @Prop()
  public familyActiveMembers: number;
}

export type ModeratorPlanDocument = HydratedDocument<ModeratorPlan>;

export const ModeratorPlanSchema = SchemaFactory.createForClass(ModeratorPlan);
