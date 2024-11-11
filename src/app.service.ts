import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('process.env', process.env)
    return 'Hello World!';
  }
}
