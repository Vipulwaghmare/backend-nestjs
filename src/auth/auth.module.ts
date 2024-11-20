import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { DatabaseModule } from '../database/database.module';
import { UsersService } from '../users/users.service';
import { usersProvider } from '../users/user.provider';
import { CryptoService } from '../services/crypto.service';
import { EmailService } from '../services/email.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    UsersService,
    ...usersProvider,
    EmailService,
    CryptoService,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/auth/update-password', method: RequestMethod.POST });
  }
}
