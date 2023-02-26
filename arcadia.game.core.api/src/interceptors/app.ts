import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  HttpArgumentsHost,
  RpcArgumentsHost,
} from '@nestjs/common/interfaces/features/arguments-host.interface';
import { RedisContext, TcpContext } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppLogger } from '../modules/logger/logger.service';

@Injectable()
export class MainAppInterceptor implements NestInterceptor {
  // eslint-disable-next-line
  constructor(@Inject(AppLogger) private readonly logger: AppLogger) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type = context.getType();
    const handler = `handle${type.charAt(0).toUpperCase() + type.slice(1)}`;
    if (typeof this[handler] === 'function') {
      return this[handler](context, next)
        .pipe(
          catchError(err => {
            if (typeof err.isAxiosError === 'boolean') {
              this.logger.error(err);
              return throwError(new HttpException((err.response && err.response.data)
                || { message: 'Fatal' },
              (err.response && err.response.status) || HttpStatus.INTERNAL_SERVER_ERROR));
            }
            return throwError(err);
          }));
    }
    return new Observable<any>();
  }

  handleHttp(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http: HttpArgumentsHost = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();
    const executionTime = request.executionTime
      ? request.executionTime
      : Date.now();

    return next.handle().pipe(
      tap(() => this.logger.access(
        request,
        {
          statusCode: response.statusCode,
        },
        executionTime,
      ),
      ),
    );
  }

  handleRpc(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpc: RpcArgumentsHost = context.switchToRpc();
    const requestContext: TcpContext | RedisContext = rpc.getContext<TcpContext>();
    const executionTime = Date.now();

    const handler = requestContext instanceof RedisContext ? this.logger.accessRedis : this.logger.accessRpc;

    return next.handle().pipe(
      tap(() => handler.call(
        this.logger,
        requestContext,
        executionTime,
      ),
      ),
    );
  }
}
