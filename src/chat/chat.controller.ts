import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { ChatService } from './chat.service';
import { AddMemberDto } from './dto/addMember.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './schemas/chat.schema';
import { Message } from './schemas/message.schema';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getChatsForUser(@Body() chats: ObjectId[]) {
    return this.chatService.getChatsForUser(chats);
  }

  @Patch('/deleteChat')
  deleteChat(@Body() id: ObjectId) {
    return this.chatService.deleteChat(id);
  }

  @Get('/:id')
  getOne(@Param('id') id: ObjectId) {
    return this.chatService.getOne(id);
  }

  @Post()
  create(@Body() dto: CreateChatDto) {
    return this.chatService.createChat(dto);
  }

  // @Patch('/update')
  // update(@Body() dto: UpdateChatDto) {
  //   return this.chatService.updateChat(dto);
  // }

  @Patch('/messages')
  saveMessageInChat(@Body() message: Message) {
    return this.chatService.saveMessageInChat(message);
  }

  @Patch('/addMember')
  addMember(@Body() dto: AddMemberDto) {
    return this.chatService.addNewMember(dto);
  }

  @Patch('/removeMember')
  removeMember(@Body() dto: AddMemberDto) {
    return this.chatService.removeMember(dto);
  }

  @Patch('/update/:id')
  update(@Body() dto: UpdateChatDto, @Param('id') id: string) {
    return this.chatService.updateChat(dto, id);
  }
}
