import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { UserService } from './user.service';
import { CurrentUser } from 'src/decorator/current.decorator';
import { User } from './user.decorator';
import { FriendsService } from 'src/friends/friends.service';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: '' })
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly friendsService: FriendsService,
    // @Inject(FriendsService) private friendsService: FriendsService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@User() user: any) {
    return await this.userService.findByUsername(user.username);
  }
  @Get('/me')
  async getCurrentUser(@CurrentUser() user: any) {
    console.log("Current user:", user);
    return user; // Assuming user is set in the request by the JwtAuthGuard
  }

  // user.controller.ts
  @Get(':userId/available-friends')
  async getAvailableFriends(@Param('userId') userId: string) {
    return this.userService.getAvailableFriends(userId);
  }
  @Get('/friends/:friendId')
  async getFriend(@Param('friendId') friendId: string) {
    return this.userService.findByUserId(friendId);
  }
  @Post('/image')
  async generateImage(@Body() reqData: { prompt: string }) {
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: reqData.prompt,
      size: "1024x1024"
    });
    return  response.data[0].url;
  }
}
