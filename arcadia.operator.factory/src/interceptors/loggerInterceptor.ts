import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger } from '../modules/logger/logger.service';
import { RabbitmqConnectorService } from '../modules/rabbitmq.connector/rabbitmq.connector.service';
import { EventSource } from '../modules/rabbitmq.connector/enum/event.source';
import { EventType } from '../modules/rabbitmq.connector/enum/event.type';

@Injectable()
export class MainAppInterceptor implements NestInterceptor {
  // eslint-disable-next-line
  constructor(
      private readonly logger: AppLogger,
      private readonly rabbitMqConnector: RabbitmqConnectorService,
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http: HttpArgumentsHost = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();
    const executionTime = request.executionTime
      ? request.executionTime
      : Date.now();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => this.logger.access(request, { statusCode: response.statusCode },
        executionTime)),
      tap(value => this.logger.log(`response: ${JSON.stringify(value)}`)),
      tap(value => this.rabbitMqConnector.sendEventLogMessage({
        source: EventSource.GAME,
        eventType: EventType.OPERATOR_LATENCY,
        params: {
          latency: Date.now() - startTime,
          operatorApiConnectorId: request.params.id,
          route: request.url,
        },
      })),
    );
  }
}
