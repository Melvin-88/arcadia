import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../modules/auth/auth.service';
import { REQUIRED_PASSWORD, WRONG_PASSWORD } from '../messages/messages';

@Injectable()
export class PasswordRequiredGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let passwordField = this.reflector.get<string>('passwordField', context.getHandler());
    if (!passwordField) {
      passwordField = 'password';
    }
    const password = request.body[passwordField];
    if (!password) {
      throw new UnauthorizedException(REQUIRED_PASSWORD.en);
    }
    const { user } = request;
    const passwordMatch = await this.authService.verifyPassword(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException(WRONG_PASSWORD.en);
    }

    return true;
  }
}
