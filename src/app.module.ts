import { TrackModule } from './track/track.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AlbumModule } from './album/album.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AlbumModule,
    TrackModule,
    FileModule,
    MongooseModule.forRoot(
      'mongodb+srv://admin:12345@cluster0.tdtmved.mongodb.net/spotify?retryWrites=true&w=majority',
    ),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
  ],
})
export class AppModule {}
