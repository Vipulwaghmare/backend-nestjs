import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { sign, verify } from 'jsonwebtoken';

type TJWTPayload = {
  userId: string;
  userEmail: string;
}

class JWT_Payload {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly userEmail: string;
}

export class JWT_DTO {
  @IsDefined({ message: 'Unauthorized! Invalid token.' })
  @ValidateNested()
  @Type(() => JWT_Payload)
  jwtPayload: JWT_Payload;
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
        expiresIn: '7d',
      },
    );
  }

  async getResetToken(userId: string): Promise<{
    token: string;
    expiryTime: Date;
  }> {
    const expiryTime = new Date(new Date().getTime() + 15 * 60 * 1000);
    const token = sign(
      { userId },
      this.configService.get('JWT_RESET_TOKEN_SECRET'),
      {
        expiresIn: '15m',
      },
    );
    return {
      token,
      expiryTime,
    };
  }

  async verifyAccessToken(token: string): Promise<TJWTPayload> {
    return verify(token, this.configService.get('JWT_ACCESS_TOKEN_SECRET')) as TJWTPayload
  }

  async verifyRefreshToken(token: string): Promise<TJWTPayload> {
    return verify(token, this.configService.get('JWT_REFRESH_TOKEN_SECRET')) as TJWTPayload
  }

  async verifyResetToken(token: string): Promise<{
    userId: string;
  }> {
    return verify(token, this.configService.get('JWT_RESET_TOKEN_SECRET')) as {
      userId: string;
    }
  }
}
