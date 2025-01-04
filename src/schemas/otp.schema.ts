import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Otp {
  @Prop()
  public email: string;

  @Prop()
  public otp: string;

  @Prop({ type: Date, expires: '1m' }) // expires in 5 minutes
  public expires: Date;
}

export type OtpDocument = HydratedDocument<Otp>;

export const OtpSchema = SchemaFactory.createForClass(Otp);
