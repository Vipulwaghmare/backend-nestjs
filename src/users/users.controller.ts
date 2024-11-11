import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('/register')
  async register(@Body() body: CreateUserDto) {
    await this.userService.create(body);
    return {}
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto) {
    return {}
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return {}
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return {}
  }

  @Post('/update-password')
  async updatePassword(@Body() body: UpdatePasswordDto) {
    return {}
  }
}
