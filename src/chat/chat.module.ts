import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from 'src/file/file.service';
import { UserModule } from 'src/user/user.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MessageModule } from './message.module';
import { MessageService } from './message.service';
import { Chat, ChatSchema } from './schemas/chat.schema';

@Module({
  controllers: [ChatController],
  imports: [
    MessageModule,
    UserModule,
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  providers: [ChatService, FileService, ChatGateway],
})
export class ChatModule {}
