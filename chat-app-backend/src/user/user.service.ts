import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { FriendRequest } from 'src/friend-request/schemas/friend-request.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>,
  ) { }

  async create(
    username: string,
    password: string,
    name: string,
  ): Promise<User> {
    const newUser = new this.userModel({ username, password, name });
    return newUser.save();
  }
  async findByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }
   async findByUserId(userId: string): Promise<User | undefined> {
    return this.userModel.findOne({  _id:  userId }).exec();
  }

  async findUsersByIds(userIds: string[]): Promise<User[] | undefined> {
    return this.userModel.find({ _id: { $in: userIds } }, '_id name').exec();
  }
  // user.service.ts
  async getAvailableFriends(userId: string) {
    // Get all other users
    const allUsers = await this.userModel.find(
      { _id: { $ne: userId } },
      '_id name'
    );

    // Get all requests involving this user
    const requests = await this.friendRequestModel.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ]
    });

    // Map of otherUserId -> info { status, requestId, receiver }
    const requestMap = new Map<
      string,
      { status: string; requestId: string; receiver: string }
    >();

    for (const req of requests) {
      const senderId = req.sender.toString();
      const receiverId = req.receiver.toString();
      const isSender = senderId === userId;
      const otherUserId = isSender ? receiverId : senderId;

      requestMap.set(otherUserId, {
        status: req.status,
        requestId: req._id.toString(),
        receiver: receiverId, // To help frontend know if current user is receiver
      });
    }

    // Combine user list with status info
    const result = allUsers.map((user) => {
      const id = user._id.toString();
      const userObj = user.toObject();

      if (requestMap.has(id)) {
        const { status, requestId, receiver } = requestMap.get(id)!;
        return {
          ...userObj,
          status,
          requestId,
          receiver,
        };
      }

      return {
        ...userObj,
        status: 'NONE',
      };
    });

    return result;
  }


}
