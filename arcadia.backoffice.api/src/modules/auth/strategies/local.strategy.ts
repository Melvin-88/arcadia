import * as Strategy from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { LoginResponse } from '../auth.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
      private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'email',
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
    const loginResponse: LoginResponse = await this.authService.login(email, password);
    try {
      return done(null, loginResponse.user);
    } catch (e) {
      return done(
        new UnauthorizedException(),
        false,
      );
    }
  }
}
