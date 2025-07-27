import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { UserService } from './user.service';
import { CurrentUser } from 'src/decorator/current.decorator';
import { User } from './user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
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
}
