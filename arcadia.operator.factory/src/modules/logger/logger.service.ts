import { Injectable, LoggerService } from '@nestjs/common';
import * as _ from 'lodash';
import {
  addLayout, Configuration, configure, getLogger, Logger,
} from 'log4js';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly accessLogger: Logger;
  private readonly errorLogger: Logger;
  private readonly commonLogger: Logger;

  constructor(private readonly configService: ConfigService) {
    addLayout('jsonLayout', config => logEvent => (
      JSON.stringify({
        dateTime: logEvent.startTime,
        level: logEvent.level.levelStr,
        message: logEvent.data,
        context: logEvent.context,
      }) + config.separator
    ),
    );
    configure(this.configService.get('log4js') as Configuration);
    this.commonLogger = getLogger();
    this.accessLogger = getLogger('access');
    this.errorLogger = getLogger('error');
  }

  access(
    request: any,
    responseStatus: {
      statusCode: number;
      errorMessage?: string;
      trace?: any;
    },
    executionTime: number = 0,
  ) {
    request.body = _.omit(request.body, ['password']);
    const clientIp: string = ((): string => {
      if (request.headers['x-forwarded-for']) {
        return request.headers['x-forwarded-for'].split(',')[0];
      }
      if (request.raw && request.raw.ip) {
        return request.raw.ip;
      }
      if (request.ip) {
        return request.ip;
      }
      if (request.connection && request.connection.remoteAddress) {
        return request.connection.remoteAddress;
      }
      return '';
    })();

    const message: Record<string, any> = {
      clientIp,
      responseStatus,
      header: {
        host: request.headers.host,
        authorization: request.headers.authorization,
        method: request.method,
        userAgent: request.headers['user-agent'],
        correlationId: request.headers.correlation,
      },
      url: request.originalUrl,
      query: request.query,
      body: request.body,
      executionTime: executionTime > 0 ? Date.now() - executionTime : 0,
    };

    this.accessLogger.info(message);
  }

  error(message: string, trace: string) {
    this.errorLogger.error({ message, trace });
  }

  log(message: string) {
    this.commonLogger.info(message);
  }

  warn(message: string) {
    this.errorLogger.warn(message);
  }
}
