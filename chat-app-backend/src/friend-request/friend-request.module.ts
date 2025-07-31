import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequestSchema, FriendRequest } from './schemas/friend-request.schema';

@Module({
 imports: [MongooseModule.forFeature([{ name: FriendRequest.name, schema: FriendRequestSchema }])],
  providers: [FriendRequestService],
  controllers: [FriendRequestController]
})
export class FriendRequestModule {}
