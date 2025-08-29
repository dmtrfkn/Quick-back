import { ObjectId } from 'mongoose';

export class UpdateChatDto {
  readonly _id: ObjectId;
  roomName?: string;
  picture?: string;
}
