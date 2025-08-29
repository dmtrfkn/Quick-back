import { ObjectId } from 'mongoose';

export class CreateChatDto {
  readonly roomName: string;
  readonly members: ObjectId[];
  readonly picture: string;
}
