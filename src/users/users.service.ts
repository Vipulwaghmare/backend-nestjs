import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) { }

  async create(createCatDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createCatDto);
    return createdUser.save();
  }
}
