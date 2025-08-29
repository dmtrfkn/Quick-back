import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
  ) {}

  async createMessage(dto: Message) {
    const mes = await this.MessageModel.create(dto);
    return mes;
  }

  async changeMessage(dto: { id: ObjectId; message: Message }) {
    const mes = await this.MessageModel.findById(dto.id);
    console.log(mes);
    mes.message = dto.message.message;
    mes.hasChanged = true;
    await mes.save();
    return mes;
  }

  async deleteMessage(id: ObjectId) {
    await this.MessageModel.findByIdAndDelete(id);
  }
}
