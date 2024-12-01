import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
  ) { }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id, {
      name: 1,
      email: 1,
      _id: 1,
    });
  }
}
