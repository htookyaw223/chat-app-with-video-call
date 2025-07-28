import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { UserService } from './user.service';
import { CurrentUser } from 'src/decorator/current.decorator';
import { User } from './user.decorator';
import { FriendsService } from 'src/friends/friends.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly friendsService: FriendsService,
    // @Inject(FriendsService) private friendsService: FriendsService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@User() user: any) {
    return await this.userService.findByUsername(user.username);
  }
  @Get('/me')
  async getCurrentUser(@CurrentUser() user: any) {
    console.log("Current user:", user);
    let friends = this.friendsService.getFriends(user.userId);
    return {...user, friends}; // Assuming user is set in the request by the JwtAuthGuard
  }
}
