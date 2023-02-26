import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
      return this[handler](context, next);
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
}
