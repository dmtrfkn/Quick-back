import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  nick: string;

  @Prop({ default: 'avatar/dj.png' })
  pictureUrl: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
      },
    ],
    default: [],
  })
  tracks: mongoose.ObjectId[];
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
      },
    ],
    default: [],
  })
  albums: mongoose.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
