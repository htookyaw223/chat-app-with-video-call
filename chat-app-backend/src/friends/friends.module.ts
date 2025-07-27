import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFriend, UserFriendSchema } from './schemas/friend.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserFriend.name, schema: UserFriendSchema },
    ]),
    UserModule
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
