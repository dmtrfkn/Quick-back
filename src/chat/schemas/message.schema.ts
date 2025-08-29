import mongoose, { Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Track } from 'src/track/schemas/track.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: ObjectId;

  @Prop({ type: Object })
  track?: {
    _id: string;
    name: string;
    artist: string;
    category: string;
    listens: number;
    picture: string;
    audio: string;
  };

  @Prop()
  senderUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'chatId' })
  chatId: ObjectId;

  @Prop()
  hasChanged: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
