import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Inject,
} from '@nestjs/common';
import { MyLogger } from '../modules/logger/logger.service';
import { STATUS_ERROR } from '../messages/messages';

@Catch()
export class APIExceptionFilter implements ExceptionFilter {
  constructor(@Inject(MyLogger) private readonly logger: MyLogger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status: number = exception.getStatus && exception.getStatus instanceof Function
      ? exception.getStatus()
      : 500;
    const responseMessage: string | Record<string, any> = exception.getResponse && exception.getResponse instanceof Function
      ? exception.getResponse()
      : 'Fatal';
    this.logger.access(
      request,
      {
        statusCode: status,
        errorMessage: <string>responseMessage,
        trace: exception.stack,
      },
      request.executionTime ? request.executionTime : 0,
    );
    this.logger.error(<string>responseMessage, exception.stack);

    response.status(status).json({
      statusMessage: STATUS_ERROR.en,
      data: responseMessage,
    });
  }
}
