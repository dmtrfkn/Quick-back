import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.userService.search(query);
  }
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }

  @Patch()
  update(@Body() dto: { pictureUrl: string; id: string }) {
    return this.userService.update(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.userService.delete(id);
  }

  @Get('/auth')
  token(@Headers('authorization') token: string) {
    return this.userService.auth(token);
  }

  @Patch('/addTrack/:id')
  async addTrack(@Param('id') id: ObjectId, @Body() dto: UpdateUserDto) {
    await this.userService.addTrack(dto, id);
    return this.userService.getOne(id);
  }
  @Patch('/addAlbum/:id')
  async addAlbum(@Param('id') id: ObjectId, @Body() dto: UpdateUserDto) {
    await this.userService.addAlbum(dto, id);
    return this.userService.getOne(id);
  }
  @Patch('/removeAlbum/:id')
  async removeAlbum(@Param('id') id: ObjectId, @Body() dto: UpdateUserDto) {
    await this.userService.removeAlbum(dto, id);
    return this.userService.getOne(id);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.userService.getOne(id);
  }

  @Patch('/removeTrack/:id')
  async removeTrack(@Param('id') id: ObjectId, @Body() dto: UpdateUserDto) {
    await this.userService.removeTrack(dto, id);
    return this.userService.getOne(id);
  }

  @Patch('/join')
  async joinToTheChat(@Body() body: { id: ObjectId; chatId: ObjectId }) {
    return this.userService.joinToTheChat(body.id, body.chatId);
  }

  @Patch('/leave')
  async leaveFromTheChat(@Body() id: ObjectId, @Body() chatId: ObjectId) {
    return this.userService.leaveOutTheChat(id, chatId);
  }
}
