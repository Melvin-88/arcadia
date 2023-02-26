import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Inject,
} from '@nestjs/common';
import { AppLogger } from '../modules/logger/logger.service';

@Catch()
export class APIExceptionFilter implements ExceptionFilter {
  constructor(@Inject(AppLogger) private readonly logger: AppLogger) {
  }

  catch(exception: Record<string, any>, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status: number = typeof exception.getStatus === 'function'
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseMessage: string | Record<string, any> = typeof exception.getResponse === 'function'
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
      statusMessage: 'Error',
      data: responseMessage,
    });
  }
}
