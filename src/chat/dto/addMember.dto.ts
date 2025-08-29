import { ObjectId } from 'mongoose';

export class AddMemberDto {
  member: ObjectId;
  readonly roomId: ObjectId;
}
