/* eslint-disable */
import { Inject, Logger as BuildInLogger } from '@nestjs/common';
import { RedisContext, TcpContext } from '@nestjs/microservices';
import { Logger } from 'arcadia-dal';
import * as _ from 'lodash';
import {
  addLayout, Configuration, configure, getLogger, Logger as Logger4js,
} from 'log4js';
import { ConfigService } from '../config/config.service';

class MySqlLogger implements Logger {
  constructor(
    private readonly mysqlQueryLogger: Logger4js,
    private readonly mysqlErrorLogger: Logger4js,
  ) {
  }

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, _parameters?: any[], _queryRunner?: any): any {
    this.mysqlQueryLogger.info(query);
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(
    _error: string,
    query: string,
    parameters?: any[],
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
  ): any {
    this.mysqlErrorLogger.warn({ time, query, parameters });
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, _queryRunner?: any): any {
    console.log(message);
  }

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, _queryRunner?: any): any {
    console.log(message);
  }

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: any): any {
    this.mysqlErrorLogger._log(level, message);
  }
}

export class AppLogger extends BuildInLogger {
  private readonly accessLogger: Logger4js;
  private readonly errorLogger: Logger4js;
  private readonly mysqlQueryLogger: Logger4js;
  private readonly mysqlErrorLogger: Logger4js;
  private readonly commonLogger: Logger4js;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super();
    addLayout('jsonLayout', config => logEvent => JSON.stringify({
      dateTime: logEvent.startTime,
      level: logEvent.level.levelStr,
      message: logEvent.data,
      context: logEvent.context,
    }) + config.separator,
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
    executionTime = 0,
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

  accessRpc(request: TcpContext | RedisContext, executionTime = 0) {
    if (request instanceof RedisContext) return;

    const message: Record<string, any> = {
      pattern: request.getPattern(),
      body: request.getArgs()[0]['content'].toString(),
      executionTime: executionTime > 0 ? Date.now() - executionTime : 0,
    };

    this.accessLogger.info(message);
  }

  accessRedis(request: TcpContext | RedisContext, executionTime = 0) {
    if (request instanceof TcpContext) return;

    const message: Record<string, any> = {
      pattern: request.getChannel(),
      body: request.getArgs(),
      executionTime: executionTime > 0 ? Date.now() - executionTime : 0,
    };

    this.accessLogger.info(message);
  }

  error(message: string, trace?: string | object) {
    this.errorLogger.error({ message, trace });
  }

  log(message: string) {
    this.commonLogger.info(message);
  }

  warn(message: string) {
    this.errorLogger.warn(message);
  }
}
