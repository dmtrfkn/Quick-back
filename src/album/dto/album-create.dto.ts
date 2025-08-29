import { ObjectId } from 'mongoose';

export class CreateAlbumDto {
  readonly artist: string;
  readonly name: string;
  readonly pictureUrl: string;
  tracks: ObjectId[];
}
