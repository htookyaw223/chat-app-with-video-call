import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
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

  async findUsersByIds(userIds:string[]): Promise<User[] | undefined> {
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }
}
