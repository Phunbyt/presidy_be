import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PlanStatus } from 'src/common/constants/enums';

@Schema({ timestamps: true })
export class Plan {
  @Prop()
  public name: string;

  @Prop()
  public price: number;

  @Prop()
  public currency: string;

  @Prop()
  public country: string;

  @Prop()
  public logoUrl: string;

  @Prop()
  public planUrl: string;

  @Prop()
  public planCode: string;

  @Prop({ default: 'active' })
  public status: PlanStatus;

  @Prop({ default: 0 })
  public members: number;

  @Prop({ default: false })
  public specialEmail: boolean;

  @Prop({ default: false })
  public specialDetails: boolean;

  @Prop({ default: false })
  public moderatorDetails: boolean;

  @Prop({ default: false })
  public webDetails: boolean;

  @Prop({ default: 5 })
  public familySize: number;
}

export type PlanDocument = HydratedDocument<Plan>;

export const PlanSchema = SchemaFactory.createForClass(Plan);
