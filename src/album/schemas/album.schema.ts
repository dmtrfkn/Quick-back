import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Track } from '../../track/schemas/track.schema';
import * as mongoose from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop()
  name: string;

  @Prop()
  artist: string;

  @Prop()
  pictureUrl: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
      },
    ],
  })
  tracks: Track[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
