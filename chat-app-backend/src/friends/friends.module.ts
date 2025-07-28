import { forwardRef, Module } from '@nestjs/common';
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
    forwardRef(() => UserModule)
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService], // Exporting FriendsService to be used in other modules
})
export class FriendsModule {}
