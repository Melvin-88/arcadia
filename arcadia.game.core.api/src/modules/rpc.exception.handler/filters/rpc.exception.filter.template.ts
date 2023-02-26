import { ArgumentsHost, OnApplicationBootstrap, RpcExceptionFilter } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { EMPTY, Observable } from 'rxjs';
import { AppLogger } from '../../logger/logger.service';

export abstract class RpcExceptionFilterTemplate implements RpcExceptionFilter<RpcException>,
  OnApplicationBootstrap {
  protected logger: AppLogger;

  protected constructor(protected readonly moduleRef: ModuleRef) {
  }

  onApplicationBootstrap(): void {
    this.logger = this.moduleRef.get(AppLogger, { strict: false });
  }

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToRpc();
    this.logger.error('RpcException', {
      message: exception.message,
      error: exception.getError(),
      handler: ctx.getContext().args[2],
      data: ctx.getData(),
    });
    return EMPTY;
  }
}
