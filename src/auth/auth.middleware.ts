import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log(req.baseUrl);
    if (req.baseUrl === '/auth/login' || req.baseUrl === '/auth/register') {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Invalid or missing Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: any;

    try {
      decodedToken = this.jwtService.verify(token, { secret: 'my_secret' });
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.authService.validateUser(decodedToken.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    req['user'] = user;
    next();
  }
}
