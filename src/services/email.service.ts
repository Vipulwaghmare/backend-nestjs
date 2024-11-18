import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
  ) { }


}
