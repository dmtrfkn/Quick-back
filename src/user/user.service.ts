import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileService, FileType } from 'src/file/file.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService,
  ) {}

  async register(dto: CreateUserDto) {
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
    const user = await this.userModel.findById(_id as ObjectId);
    return user;
  }

  async getAll() {
    const users = await this.userModel.find();
    return users;
  }

  async delete(id: ObjectId) {
    await this.userModel.findOneAndDelete(id);
    return 'Success';
  }

  async update(dto: UpdateUserDto, picture) {
    const picturePath = this.fileService.createFile(FileType.USER, picture);
    await this.userModel.findOneAndUpdate({
      ...dto,
      picturePath,
    });
  }
  async getOne(id: ObjectId): Promise<User> {
    const user = await (await this.userModel.findById(id)).populate('tracks');
    return user;
  }
  async addTrack(dto: UpdateUserDto, id: ObjectId) {
    const user = await this.userModel.findById(id);
      user.tracks = user.tracks.filter(i => i.valueOf() !== dto.trackId)
      user.tracks.push(dto.trackId)
    await user.save();
  }

  async removeTrack(dto: UpdateUserDto, id: ObjectId) {
    const user = await this.userModel.findById(id);
    user.tracks = user.tracks.filter(i => i.valueOf() !== dto.trackId)
    await user.save();
  }
}
