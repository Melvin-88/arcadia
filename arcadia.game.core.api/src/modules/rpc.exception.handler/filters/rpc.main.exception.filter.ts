import { ArgumentsHost, Catch, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RpcExceptionFilterTemplate } from './rpc.exception.filter.template';

@Injectable()
@Catch(RpcException)
export class RpcMainExceptionFilter extends RpcExceptionFilterTemplate {
  constructor(moduleRef: ModuleRef) {
    super(moduleRef);
  }

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return super.catch(exception, host);
  }
}
