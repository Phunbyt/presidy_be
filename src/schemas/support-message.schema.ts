import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class SupportMessage {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop()
  public message: string;
}

export type SupportMessageDocument = HydratedDocument<SupportMessage>;

export const SupportMessageSchema =
  SchemaFactory.createForClass(SupportMessage);
