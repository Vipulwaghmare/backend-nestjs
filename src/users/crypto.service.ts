import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

type TJWTPayload = {
  userId: string;
  userEmail: string;
}

@Injectable()
export class CryptoService {
  constructor(
    private readonly configService: ConfigService,
  ) { }

  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  async getAccessToken(payload: TJWTPayload): Promise<string> {
    return sign(
      payload,
      this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      {
        expiresIn: '1d',
      },
    );
  }

  async getRefreshToken(payload: TJWTPayload): Promise<string> {
    return sign(
      payload,
      this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      {
        expiresIn: '1d',
      },
    );
  }

  async verifyAccessToken(token: string): Promise<TJWTPayload> {
    return verify(token, this.configService.get('JWT_ACCESS_TOKEN_SECRET')) as TJWTPayload
  }

  async verifyRefreshToken(token: string): Promise<TJWTPayload> {
    return verify(token, this.configService.get('JWT_REFRESH_TOKEN_SECRET')) as TJWTPayload
  }
}
