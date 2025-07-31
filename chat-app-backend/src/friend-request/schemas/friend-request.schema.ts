// friend-request.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum FriendRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

@Schema({ timestamps: true })
export class FriendRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver: Types.ObjectId;

  @Prop({ enum: FriendRequestStatus, default: FriendRequestStatus.PENDING })
  status: FriendRequestStatus;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
