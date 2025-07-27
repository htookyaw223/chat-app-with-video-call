import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private activeUsers = new Map<string, any>();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    const decoded = this.jwtService.decode(token);
    socket.data.user = decoded; // Attach user info to socket for later use
    const data = {
      ...decoded.payload,
      socketId: socket.id,
      status: 'online',
    };
    this.activeUsers.set(data?.userId, data);
    // console.log(`User connected: ${decoded}`);
    // console.log(`New client connected: this.activeUsers`, this.activeUsers);
  }

  handleDisconnect(client: Socket) {
    console.log("disconnected the socket")
    const userId = [...this.activeUsers.entries()]
      .find(([_, socketId]) => socketId === client.id)?.[0];
    if (userId) {
      this.activeUsers.delete(userId);
    }
    console.log(`Active users after disconnect:`, this.activeUsers);
  }

  @SubscribeMessage('signal')
  handleSignal(socket: Socket, data: any) {
    console.log('Received signal:', data.type, data.to);
    socket.broadcast.emit('signal', data);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, data: any) {
    const targetSocketId = this.activeUsers.get(data?.to)?.socketId;
    console.log('Target socket ID:', targetSocketId, " sender socket id:", socket.id);
    //send message to the specific user
    this.server.to(targetSocketId).emit('receiveMessage', {
      message: data.message,
      socketId: socket.id,
      sender: socket.data.user, // or any sender info you want to include
    });

    // console.log('Received signal:', data, socket.id)
  }
}
