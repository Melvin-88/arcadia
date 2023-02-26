import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException,
} from '@nestjs/common';
import { STATUS_ERROR } from '../messages/messages';
import { AppLogger } from '../modules/logger/logger.service';

@Catch()
export class APIExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status: number = exception.getStatus && exception.getStatus instanceof Function
      ? exception.getStatus()
      : 500;
    const responseMessage: string | Record<string, any> = exception.getResponse
    && exception.getResponse instanceof Function
      ? exception.getResponse()
      : 'Fatal';
    this.logger.access(
      request,
      {
        statusCode: status,
        errorMessage: responseMessage as string,
        trace: exception.stack,
      },
      request.executionTime ? request.executionTime : 0,
    );
    this.logger.error(({
      responseMessage,
      correlationId: request.headers.correlation,
    } as unknown as string), exception.stack);

    response.status(status).json({
      statusMessage: STATUS_ERROR.en,
      data: responseMessage,
    });
  }
}
