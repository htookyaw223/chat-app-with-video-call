import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserFriend } from './schemas/friend.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { FriendDto } from './dto/friend.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(UserFriend.name) private userFriendModel: Model<UserFriend>,
     private readonly userService: UserService, // Correct way to inject UserService
  ) { }

  async getFriends(userId: string): Promise<FriendDto[]> {
    try {
      const userFriends = await this.userFriendModel.findOne({ userId }).exec();
      console.log('User Friends:', userFriends);
      // You may want to fetch User objects based on friend IDs, but for now return an empty array to avoid errors
      let users = await this.userService.findUsersByIds(userFriends.friends?.filter(f => f.requestStatus === 'accepted').map(friend => friend.userId));
      return users.map(user => ({
        userId: user._id.toString(),
        name: user.name,
        requestStatus: 'accepted', // Assuming all returned users are accepted friends    
      }))
    } catch (error) {
      console.error('Error fetching friends:', error);
      throw new Error('Could not fetch friends');
    }
  }
}
