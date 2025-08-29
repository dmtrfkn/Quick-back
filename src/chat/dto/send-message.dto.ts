import { ObjectId } from 'mongoose';

export class SendMessageDto {
  sender: ObjectId;
  message: string;
  hasChanged: boolean;
  chatId: ObjectId;
}
