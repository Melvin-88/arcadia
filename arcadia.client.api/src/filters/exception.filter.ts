import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger,
} from '@nestjs/common';

@Catch()
export class APIExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status: number = exception.getStatus && exception.getStatus instanceof Function
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseMessage: string | Record<string, any> = exception.getResponse
    && exception.getResponse instanceof Function
      ? exception.getResponse()
      : 'Fatal';
    this.logger.error({
      request: {
        method: request.method,
        url: request.url,
        body: request.body,
        query: request.query,
        params: request.params,
      },
      statusCode: status,
      errorMessage: responseMessage as string,
      correlationId: request.headers.correlation,
      executionTime: request.executionTime ? request.executionTime : 0,
    }, exception.stack);
    response.status(status).json({
      statusMessage: 'ERROR',
      data: responseMessage,
    });
  }
}
