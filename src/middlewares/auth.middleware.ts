import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CryptoService } from '../services/crypto.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private cryptoService: CryptoService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = await this.cryptoService.verifyAccessToken(token);
      req.body.jwtPayload = {
        userId: decoded.userId,
        userEmail: decoded.userEmail,
      };
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  }
}
