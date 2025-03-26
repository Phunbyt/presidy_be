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

  @Prop({ default: false })
  public isVerified: boolean;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

const ppp = {
  data: {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzY5ZTAzMzgzMmZlN2Q5ZTZlY2ZmMWYiLCJlbWFpbCI6InBodW5ieXRjb2RlQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM0OTkxOTI0LCJleHAiOjE3MzQ5OTU1MjR9.zB3TxdHngo8DjnOcg9pBpZF6QT1XRi7UChmqqQkZOGU',
    newUser: {
      __v: 0,
      _id: '6769e033832fe7d9e6ecff1f',
      createdAt: '2024-12-23T22:12:03.898Z',
      email: 'phunbytcode@gmail.com',
      firstName: 'rubin',
      lastName: 'mind',
      password: '$2b$10$2utPbFxGU.IbCpvdbTvqK.in4J7VV0J5HnFGr62PGj3vI0RzR23y6',
      updatedAt: '2024-12-23T22:12:03.898Z',
      username: 'rubmind',
    },
  },
  pagination: false,
  path: '/api/v1/auth/sign-up',
  status: true,
  statusCode: 201,
};
