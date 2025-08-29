import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schemas/track.schema';
import { Model } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateTrackDto): Promise<Track> {
    // const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    // const picturePath = this.fileService.createFile(FileType.IMAGE, picture);

    const track = new this.trackModel({
      ...dto,
      listens: 0,
    });
    return track.save();
  }

  async getAll(count = 10, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel
      .find()
      .skip(Number(offset))
      .limit(Number(count));
    return tracks;
  }

  async search(query): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await await this.trackModel.findById(id);
    return track;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    return track._id;
  }

  // async listen(id: ObjectId) {
  //   const track = await this.trackModel.findById(id);
  //   track.listens += 1;
  //   track.save();
  // }

  async category(category: string) {
    const tracks = await this.trackModel.find({ category });
    return tracks;
  }
}
