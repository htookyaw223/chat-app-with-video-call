import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { SocketConnectedUser } from './schemas/socket.user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SocketConnectedUser.name)
    private socketConnectedUserModel: Model<SocketConnectedUser>,
  ) {}

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
  async connectSocketByUser(params: any) {
    let connectedUser = await this.socketConnectedUserModel.findOne({
      userId: params.userId,
    });
    if (connectedUser) {
      // Update fields if the user exists
      connectedUser = Object.assign(connectedUser, params);
    } else {
      // Create a new document if it doesn't exist
      connectedUser = new this.socketConnectedUserModel({
        ...params,
        status: 'offline',
      });
    }

    // Save the document to persist changes (either as an update or a new document)
    return connectedUser.save();
  }
  async findConnectedUserByUserId(
    userId: string,
  ): Promise<SocketConnectedUser | undefined> {
    return this.socketConnectedUserModel.findOne({ userId }).exec();
  }

  async findUsersByIds(userIds:string[]): Promise<User[] | undefined> {
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }
}
