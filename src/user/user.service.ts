import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileService, FileType } from 'src/file/file.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Chat } from 'src/chat/schemas/chat.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(dto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(dto.password, salt);
      dto.password = passwordHash;
      const user = await this.userModel.create({
        ...dto,
      });

      const token = jwt.sign(
        {
          _id: user._id,
        },
        'Join',
        {
          expiresIn: '30d',
        },
      );

      return { user, token };
    } catch (error) {
      throw new HttpException(
        'Такой ник или email уже кто-то использует',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const { email } = dto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        return {
          message: 'Неверный логин или пароль',
        };
      }

      const isValidPassword = await bcrypt.compare(dto.password, user.password);

      if (!isValidPassword) {
        return {
          message: 'Неверный логин или пароль',
        };
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        'Join',
        {
          expiresIn: '30d',
        },
      );

      return { user, token };
    } catch (error) {
      console.log(error);
      return {
        message: 'Ошибка авторизации',
      };
    }
  }

  async auth(token: string): Promise<User> {
    const _id = jwt.verify(token.replace(/Bearer\s?/, ''), 'Join');
    const user = await this.userModel
      .findById(_id as ObjectId)
      .populate('tracks')
      .populate('chats');
    return user;
  }

  async getAll() {
    const users = await this.userModel.find();
    return users;
  }

  async search(query: string): Promise<User[]> {
    const tracks = await this.userModel.find({
      nick: { $regex: new RegExp(query, 'i') },
    });
    return tracks;
    // const users = await this.userModel.find();
    // return users
    //   .reverse()
    //   .filter((i) => i.nick.toLowerCase().includes(search.toLowerCase()));
  }

  async delete(id: ObjectId) {
    await this.userModel.findOneAndDelete(id);
    return 'Success';
  }

  async update(dto: { pictureUrl: string; id: string }) {
    const user = await this.userModel.findById(dto.id);
    user.pictureUrl = dto.pictureUrl;
    await user.save();
    return user;
  }
  async getOne(id: ObjectId): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('tracks')
      .populate('chats')
      .populate('albums')
      .populate({
        path: 'albums',
        populate: {
          path: 'tracks',
          model: 'Track',
        },
      });
    return user;
  }
  async addTrack(dto: UpdateUserDto, id: ObjectId) {
    const user = await this.userModel.findById(id);
    user.tracks = user.tracks.filter((i) => i.valueOf() !== dto.trackId);
    user.tracks.push(dto.trackId);
    await user.save();
  }

  async removeTrack(dto: UpdateUserDto, id: ObjectId) {
    const user = await this.userModel.findById(id);
    user.tracks = user.tracks.filter((i) => i.valueOf() !== dto.trackId);
    await user.save();
  }
  async addAlbum(dto: UpdateUserDto, id: ObjectId) {
    const user = await this.userModel.findById(id);
    user.albums = user.albums.filter((i) => i.valueOf() !== dto.trackId);
    user.albums.push(dto.trackId);
    await user.save();
  }

  async removeAlbum(dto: UpdateUserDto, id: ObjectId) {
    const user = await this.userModel.findById(id);
    user.albums = user.albums.filter((i) => i.valueOf() !== dto.trackId);
    await user.save();
  }

  async joinToTheChat(id: ObjectId, chatId: ObjectId) {
    console.log(id);
    const user = await this.userModel.findById(id);
    user.chats = user.chats.filter((i) => i.valueOf() !== chatId.valueOf());
    user.chats.push(chatId);
    await user.save();
  }

  async leaveOutTheChat(id: ObjectId, chatId: ObjectId) {
    const user = await this.userModel.findById(id);
    user.chats = user.chats.filter((i) => i.valueOf() !== chatId.valueOf());
    await user.save();
  }
}
