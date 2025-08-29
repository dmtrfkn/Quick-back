import mongoose, { Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Message } from './message.schema';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    default: [],
  })
  messages: ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  members: ObjectId[];

  @Prop()
  roomName: string;

  @Prop({ default: 'chatdef/915ecb0d-66f3-4563-9c5f-10338bb690b3.svg' })
  picture: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
