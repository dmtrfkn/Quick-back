import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Chat } from 'src/chat/schemas/chat.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  nick: string;

  @Prop({ default: 'avatar/b82055ac-3401-4d03-8301-67b2ad4c5bdd.png' })
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

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
      },
    ],
    default: [],
  })
  chats: mongoose.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
