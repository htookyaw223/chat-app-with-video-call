import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';

@Controller('friend-requests')
export class FriendRequestController {
  constructor(private readonly service: FriendRequestService) {}

  @Post('send')
  send(@Body() body: { senderId: string; receiverId: string }) {
    return this.service.sendRequest(body.senderId, body.receiverId);
  }

  @Post('respond')
  respond(@Body() body: { requestId: string; action: 'ACCEPT' | 'DECLINE' }) {
    return this.service.respondToRequest(body.requestId, body.action);
  }

  @Get(':userId/received')
  getReceived(@Param('userId') userId: string) {
    return this.service.getReceivedRequests(userId);
  }

  @Get(':userId/sent')
  getSent(@Param('userId') userId: string) {
    return this.service.getSentRequests(userId);
  }
}

