import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [SocketGateway],
  imports: [UserModule, JwtModule],
})
export class SocketModule {}
