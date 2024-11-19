import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { usersProvider } from './user.provider';
import { CryptoService } from '../services/crypto.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { EmailService } from 'src/services/email.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProvider, CryptoService, EmailService],

})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/update-password', method: RequestMethod.POST });
  }
}
