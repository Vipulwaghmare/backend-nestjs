import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MessagesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
