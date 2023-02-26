import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BoModulesEntity } from 'arcadia-dal';
import { ACCESS_TO_THE_MODULE_IS_DENIED } from '../messages/messages';

@Injectable()
export class ModuleAccessGuard implements CanActivate {
  constructor(
        private reflector: Reflector,
  ) { }

  private static hasAccessToTheModule(userPermittedModules: BoModulesEntity[], moduleTag: string | string[]): boolean {
    return userPermittedModules.some(module => moduleTag.includes(module.tag));
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!ModuleAccessGuard.hasAccessToTheModule(request.user.permittedModules, this.reflector.get<string>('tag', context.getHandler()))) {
      throw new ForbiddenException(ACCESS_TO_THE_MODULE_IS_DENIED.en);
    }

    return true;
  }
}
