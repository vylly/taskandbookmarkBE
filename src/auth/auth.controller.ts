import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { signupError } from './utils';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Public()
  @Post('signup')
  async create(@Request() req, @Body() createUserDto: CreateUserDto) {
    console.log('createUserDto: ', createUserDto);
    console.log('req:', req);
    try {
      const res = await this.userService.createUser(createUserDto);
      return this.authService.login(res);
    } catch (error) {
      const err = signupError(error.message);
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
