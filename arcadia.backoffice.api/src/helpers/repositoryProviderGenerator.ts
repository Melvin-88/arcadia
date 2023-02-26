import { Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  getConnectionToken,
  getRepositoryToken,
  connectionNames,
  ObjectType,
  Repository,
} from 'arcadia-dal';
import * as requestIp from 'request-ip';

export function provideRepository<T>(providedRepo: ObjectType<T>, isAudit = false): any {
  providedRepo.bind(Repository);
  const connectionName = isAudit ? connectionNames.AUDIT : connectionNames.DATA;
  return {
    provide: getRepositoryToken(providedRepo, connectionName),
    useFactory: (connection, request: any) => {
      const handler = {
        get(target, propKey) {
          if (!~['save', 'update', 'insert'].indexOf(propKey)) {
            return Reflect.get(target, propKey);
          }
          const origMethod = target[propKey];
          return function applyMetadata(...args) {
            if (!request) {
              return origMethod.apply(this, args);
            }

            const entities = args.shift();
            (Array.isArray(entities) ? entities : [entities]).map(entity => entity.userLogData = {
              userId: request.user.id,
              userEmail: request.user.email,
              userName: `${request.user.firstName} ${request.user.lastName}`,
              contextId: request.uuid,
              ip: requestIp.getClientIp(request),
              route: request.path,
              timestamp: new Date().getTime(),
            });
            return origMethod.apply(this, [entities, ...args]);
          };
        },
      };

      const repo: any = connection.getCustomRepository(providedRepo);
      return new Proxy(repo, handler);
    },
    inject: [getConnectionToken(connectionName), REQUEST],
    scope: Scope.REQUEST,
  };
}
