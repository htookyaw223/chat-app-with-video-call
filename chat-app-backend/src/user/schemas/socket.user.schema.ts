import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SocketConnectedUser extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  socketId: string;

  @Prop({ default: 'online' })
  status: string;
  @Prop({ default: false })
  isWriting: boolean;
}

export const SocketConnectedUserSchema =
  SchemaFactory.createForClass(SocketConnectedUser);
