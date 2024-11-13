import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.viewUser(username);
    if (user) {
      const passwordValid = await bcrypt.compare(pass, user.password);
      if (!passwordValid) return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 2);
    return {
      access_token: this.jwtService.sign(payload),
      expiredAt: expiredAt,
    };
  }
}
