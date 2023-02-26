import {
  Catch,
  Injectable,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EMPTY, Observable } from 'rxjs';
import { AppLogger } from '../modules/logger/logger.service';
import { RpcValidationException } from '../exceptions/rpcvalidation.exception';

@Injectable()
@Catch(RpcValidationException)
export class RpcValidationExceptionFilter implements RpcExceptionFilter<RpcException> {
  constructor(
    private readonly logger: AppLogger,
  ) {}

  catch(exception: RpcValidationException): Observable<never> {
    const message = {
      message: 'Validation of message data failed',
      exception: JSON.stringify(exception),
    };
    this.logger.error(`${JSON.stringify(message)}`);
    return EMPTY;
  }
}
