import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { usersProvider } from './user.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ...usersProvider
  ],
  exports: [UsersService],
})
export class UsersModule { }
