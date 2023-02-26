import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'arcadia-dal';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(
      private readonly authService: AuthService,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(request: Request, token: string): Promise<UserEntity | string> {
    const user = await this.authService.validateToken(token);
    if (typeof user === 'undefined') {
      throw new UnauthorizedException();
    }

    request.user = user;

    return user;
  }
}
