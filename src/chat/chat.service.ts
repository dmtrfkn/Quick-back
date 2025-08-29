import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { UserService } from 'src/user/user.service';
import { AddMemberDto } from './dto/addMember.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { MessageService } from './message.service';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Message } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  async getChatsForUser(chats: ObjectId[]): Promise<Chat[]> {
    const userChats = await this.chatModel.find({ _id: { $in: chats } });
    return userChats;
  }

  async getOne(id: ObjectId): Promise<Chat> {
    const chat = await this.chatModel
      .findById(id)
      .populate('messages')
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User',
        },
      })
      .populate('members');
    return chat;
  }

  async createChat(dto: CreateChatDto): Promise<Chat> {
    const newChat = await this.chatModel.create(dto);
    newChat.members.map((i) => this.userService.joinToTheChat(i, newChat._id));
    return newChat.save();
  }

  async saveMessageInChat(message: Message) {
    const chat = await this.chatModel.findById(message.chatId);
    const mes = await this.messageService.createMessage(message);
    chat.messages.push(mes._id);
    await chat.save();
  }

  async updateChat(dto: UpdateChatDto, id: string) {
    const chat = await this.chatModel.findById(id);
    chat.roomName = dto.roomName;
    chat.picture = dto.picture;
    await chat.save();
  }

  async addNewMember(dto: AddMemberDto) {
    const chat = await this.chatModel.findById(dto.roomId);
    chat.members = chat.members.filter((i) => i !== dto.member.valueOf());
    chat.members.push(dto.member);
    await chat.save();
    return this.userService.joinToTheChat(dto.member, dto.roomId);
  }

  async removeMember(dto: AddMemberDto) {
    const chat = await this.chatModel.findById(dto.roomId);
    chat.members = chat.members.filter(
      (i) => i.valueOf() !== dto.member.valueOf(),
    );
    await chat.save();
    return this.userService.leaveOutTheChat(dto.member, dto.roomId);
  }

  // async saveChat(chat: Chat): Promise<void> {
  //   const createdChat = new this.chatModel(chat);
  //   await createdChat.save();
  // }

  // async changeMessage(dto: { chatId: ObjectId,messageId: ObjectId, message: string }) {
  //   const chat = await this.chatModel.findById(dto.chatId);
  //   const i = chat.messages.findIndex(i => i. === dto.messageId)
  //   chat.messages[i].message = dto.message
  // }

  async updateMessage(dto: { id: ObjectId; message: Message }) {
    console.log(dto);
    return this.messageService.changeMessage(dto);
    // // this.chatModel.findById(dto.id)
    // const chat = await this.chatModel.findById(dto.message.chatId);
    // // .populate('messages');
    // const a = chat.messages.findIndex((i) => i === dto.id);
    // chat.messages[a] = (await mes)._id;
    // await chat.save();
  }

  async deleteMessage(dto: { id: ObjectId; chatId: ObjectId }) {
    const chat = await this.chatModel.findById(dto.chatId);
    chat.messages = chat.messages.filter(
      (i) => (i.valueOf() as string) !== (dto.id.valueOf() as string),
    );
    await chat.save();
    return this.messageService.deleteMessage(dto.id);
  }

  async deleteChat(id: ObjectId) {
    await this.chatModel.findOneAndDelete(id);
    return 'success';
  }
}
