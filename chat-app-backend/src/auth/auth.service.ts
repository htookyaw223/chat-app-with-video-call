import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // const { password,username} = user;
      return { username: user.username, id: user.id };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, userId: user.id };
    return {
      access_token: this.jwtService.sign({ payload }),
    };
  }

  async register(username: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create(username, hashedPassword, name);
  }
}
