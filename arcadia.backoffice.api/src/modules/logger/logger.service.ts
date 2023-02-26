/* eslint-disable */
import { LoggerService, Inject } from '@nestjs/common';
import {
  Configuration,
  Logger as Logger4js,
  configure,
  getLogger,
  addLayout,
} from 'log4js';
import { Logger } from 'arcadia-dal';
import * as _ from 'lodash';
import { ConfigService } from '../config/config.service';

class MySqlLogger implements Logger {
  constructor(
    private readonly mysqlQueryLogger: Logger4js,
    private readonly mysqlErrorLogger: Logger4js,
  ) {}

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], queryRunner?: any): any {
    this.mysqlQueryLogger.info(query);
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: any,
  ): any {
    this.mysqlErrorLogger.error({ query, parameters });
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: any,
  ): any {
    this.mysqlErrorLogger.warn({ time, query, parameters });
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, queryRunner?: any): any {}

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, queryRunner?: any): any {}

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: any,
  ): any {
    this.mysqlErrorLogger._log(level, message);
  }
}

export class MyLogger implements LoggerService {
  private readonly accessLogger: Logger4js;
  private readonly errorLogger: Logger4js;
  private readonly mysqlQueryLogger: Logger4js;
  private readonly mysqlErrorLogger: Logger4js;
  private readonly commonLogger: Logger4js;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
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
    this.mysqlQueryLogger = getLogger('mysqlQuery');
    this.mysqlErrorLogger = getLogger('mysqlError');
    this.errorLogger = getLogger('error');
  }

  getMysqlLogger(): MySqlLogger {
    return new MySqlLogger(this.mysqlQueryLogger, this.mysqlErrorLogger);
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
    })();

    const message: Record<string, any> = {
      clientIp,
      responseStatus,
      header: {
        host: request.headers.host,
        authorization: request.headers.authorization,
        method: request.method,
        userAgent: request.headers['user-agent'],
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
