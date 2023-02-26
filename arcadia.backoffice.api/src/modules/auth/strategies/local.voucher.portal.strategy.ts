import * as Strategy from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { LoginVoucherPortalResponse } from '../auth.interface';

@Injectable()
export class LocalVoucherPortalStrategy extends PassportStrategy(Strategy, 'localVoucherPortal') {
  constructor(
      private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  public async validate(
    req: Request,
    email: string,
    password: string,
    done: Function,
  ): Promise<void> {
    const loginResponse: LoginVoucherPortalResponse = await this.authService.loginVoucherPortal(email, password);
    try {
      return done(null, loginResponse.operator);
    } catch (e) {
      return done(
        new UnauthorizedException(),
        false,
      );
    }
  }
}
