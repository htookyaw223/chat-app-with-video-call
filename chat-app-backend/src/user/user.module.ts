import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { FriendsModule } from 'src/friends/friends.module';
import { FriendsService } from 'src/friends/friends.service';
import { FriendRequest, FriendRequestSchema } from 'src/friend-request/schemas/friend-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: FriendRequest.name, schema: FriendRequestSchema } // Assuming FriendRequest schema is defined elsewhere
    ]),
    forwardRef(() => FriendsModule)
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
