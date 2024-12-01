import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { CreateUserDto } from '../auth/dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) { }

  async create(createCatDto: CreateUserDto): Promise<User | { error: string }> {
    try {
      const createdUser = new this.userModel(createCatDto);
      return createdUser.save();
    } catch (error) {
      return { error }
    }
  }

  async update(id: string, updateCatDto: {
    name?: string;
    email?: string;
    password?: string;
    passwordResetData?: { expiryTime: Date; token: string };
  }): Promise<User | { error: string }> {
    try {
      return this.userModel.findByIdAndUpdate(id, updateCatDto, { new: true }).exec();
    } catch (error) {
      return { error }
    }
  }

  async findByEmail(email: string, fields = {}): Promise<User | undefined> {
    return this.userModel.findOne({ email }, fields).exec();
  };

  async findById(id: string, fields = {}): Promise<User | undefined> {
    return this.userModel.findById(id, fields).exec();
  };
}
