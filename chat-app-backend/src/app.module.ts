import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SocketModule } from './chat/socket.module';
import { FriendsModule } from './friends/friends.module';
import { FriendRequestService } from './friend-request/friend-request.service';
import { FriendRequestController } from './friend-request/friend-request.controller';
import { FriendRequestModule } from './friend-request/friend-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.MONGODB_URI, //configService.get<string>('mongodb://localhost:27017/testing'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    SocketModule,
    FriendsModule,
    FriendRequestModule,
  ]
})
export class AppModule {}
