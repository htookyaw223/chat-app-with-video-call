import { Controller, Get, Param } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}
    @Get("/:userId")
    async getFriends(@Param("userId") userId: string) {
       return this.friendsService.getFriends(userId);
    }
}
