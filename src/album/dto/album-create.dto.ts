import { ObjectId } from 'mongoose';

export class CreateAlbumDto {
  readonly artist: string;
  readonly name: string;
  tracks: string | ObjectId[];
}
