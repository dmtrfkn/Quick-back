import { Body, OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ObjectId } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { Track } from 'src/track/schemas/track.schema';
import { ChatService } from './chat.service';
import { Message } from './schemas/message.schema';

@WebSocketGateway(9001, { cors: { origin: '*' } })
export class ChatGateway implements OnModuleInit {
  constructor(private chatService: ChatService) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('newMessage')
  handleMessage(@MessageBody() body: Message) {
    console.log(body);
    const room = body.chatId;
    this.chatService.saveMessageInChat(body);
    this.server
      .to(room.toString())
      .emit('onMessage', { status: 'NewMessage!', content: body });
  }

  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() body: ObjectId,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = body.valueOf() as string;
    // console.log(room);
    socket.join(room);
    socket.emit('joinRoom', 'You join');
  }

  @SubscribeMessage('leave')
  handleLeaveRoom(
    @MessageBody() body: ObjectId,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(body);
    const room = body.valueOf() as string;
    socket.leave(room);
    socket.emit('leaveRoom', 'You leave');
  }

  @SubscribeMessage('deleteMessage')
  handleMessageDelete(@MessageBody() body: { id: ObjectId; chatId: ObjectId }) {
    this.chatService.deleteMessage(body);
  }

  @SubscribeMessage('updateMessage')
  handleMessageUpdate(@MessageBody() body: { id: ObjectId; message: Message }) {
    console.log(body);
    this.chatService.updateMessage(body);
    const room = body.message.chatId.valueOf() as string;
    this.server
      .to(room)
      .emit('updateMes', { mes: 'Success update', body: body });
  }

  @SubscribeMessage('add')
  handleMessageAdd(
    @MessageBody() body: { roomId: ObjectId; member: ObjectId },
  ) {
    this.chatService.addNewMember(body);
    const room = body.roomId.valueOf() as string;
    this.server.to(room).emit('addMember', { mes: 'Success add', body: body });
  }

  @SubscribeMessage('remove')
  handleMessageRemove(
    @MessageBody() body: { roomId: ObjectId; member: ObjectId },
  ) {
    this.chatService.removeMember(body);
    const room = body.roomId.valueOf() as string;
    this.server
      .to(room)
      .emit('removeMember', { mes: 'Success remove', body: body });
  }
}

// {
//     "message": "HI",
//     "sender": "635502cd9eb1360b99a4f9c5",
//     "chatId": "6382eace5f4b0b6ce90308f2",
//     "hasChanged": false
// }
