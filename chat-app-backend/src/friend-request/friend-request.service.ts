import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { FriendRequest, 
     FriendRequestStatus } from './schemas/friend-request.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>,
  ) {}

  async sendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('You cannot send a friend request to yourself.');
    }

    const existing = await this.friendRequestModel.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'PENDING',
    });

    if (existing) throw new ConflictException('Friend request already sent.');

    const newRequest = new this.friendRequestModel({
      sender: senderId,
      receiver: receiverId,
    });

    return newRequest.save();
  }

  async respondToRequest(requestId: string, action: 'ACCEPT' | 'DECLINE') {
    const request = await this.friendRequestModel.findById(requestId);
    if (!request || request.status !== 'PENDING') {
      throw new NotFoundException('Request not found or already responded.');
    }
    request.status  = action === 'ACCEPT' ? FriendRequestStatus.ACCEPTED : FriendRequestStatus.DECLINED;
    return request.save();
  }

  async  getReceivedRequests(userId: string) {
    return this.friendRequestModel
      .find({ receiver: userId, status: 'PENDING' })
      .populate('sender', 'username name');
  }

  async getSentRequests(userId: string) {
    return this.friendRequestModel
      .find({ sender: userId, status: 'PENDING' })
      .populate('receiver', 'username name');
  }
}
