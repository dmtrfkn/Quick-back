import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { CreateAlbumDto } from './dto/album-create.dto';
import { Album, AlbumDocument } from './schemas/album.schema';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateAlbumDto, picture): Promise<Album> {
    const picturePath = this.fileService.createFile(
      FileType.ALBUMIMAGE,
      picture,
    );
    const tracks = JSON.parse(dto.tracks as string);
    const album = await this.albumModel.create({
      ...dto,
      tracks,
      pictureUrl: picturePath,
    });

    return album;
  }

  async getAll(): Promise<Album[]> {
    const albums = await this.albumModel.find();
    return albums;
  }

  async getOne(id: ObjectId): Promise<Album> {
    const album = await (await this.albumModel.findById(id)).populate('tracks');
    return album;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const album = await this.albumModel.findByIdAndDelete(id);
    return album._id;
  }
}
