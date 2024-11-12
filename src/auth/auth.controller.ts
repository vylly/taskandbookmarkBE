import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { signinError } from './utils';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Public()
  @Post('signin')
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('createUserDto: ', createUserDto);
    try {
      const res = await this.userService.createUser(createUserDto);
      return res;
    } catch (error) {
      const err = signinError(error.message);
      return err;
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }
}
