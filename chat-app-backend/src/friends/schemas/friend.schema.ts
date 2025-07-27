import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Friend {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: ['pending', 'accepted', 'rejected'] })
  requestStatus: 'pending' | 'accepted' | 'rejected';
}

@Schema()
export class UserFriend extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [Friend], default: [] })
  friends: Friend[];
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
export const UserFriendSchema = SchemaFactory.createForClass(UserFriend);
