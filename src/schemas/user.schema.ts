import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  public firstName: string;

  @Prop({ required: true })
  public lastName: string;

  @Prop({ required: true })
  public country: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    validate: {
      async validator(value: string) {
        const existingUser = await this.constructor.findOne({
          username: value,
        });

        return !existingUser;
      },
      message: 'Username already in use',
    },
  })
  public username: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    validate: {
      async validator(value: string) {
        const existingUser = await this.constructor.findOne({ email: value });

        return !existingUser;
      },
      message: 'Duplicate email entered',
    },
  })
  public email: string;

  @Prop({ default: '' })
  public password: string;

  @Prop()
  public phoneNumber: number;

  @Prop({ default: false })
  public isVerified: boolean;

  @Prop({ default: false })
  public isModerator: boolean;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
