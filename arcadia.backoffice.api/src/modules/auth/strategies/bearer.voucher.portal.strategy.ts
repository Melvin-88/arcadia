import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OperatorEntity } from 'arcadia-dal';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class BearerVoucherPortalStrategy extends PassportStrategy(Strategy, 'voucherPortalBearer') {
  constructor(
      private readonly authService: AuthService,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(request: Request, token: string): Promise<OperatorEntity | string> {
    const operator = await this.authService.validateVoucherPortalToken(token);
    if (typeof operator === 'undefined') {
      throw new UnauthorizedException();
    }
    return operator;
  }
}
