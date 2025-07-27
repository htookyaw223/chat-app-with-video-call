import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { SocketGateway } from 'src/chat/socket.gateway';
import { SocketModule } from 'src/chat/socket.module';
import {
  SocketConnectedUser,
  SocketConnectedUserSchema,
} from './schemas/socket.user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: SocketConnectedUser.name, schema: SocketConnectedUserSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
