import { ValidationError } from '@nestjs/common';
import { RpcValidationException } from './rpc.validation.exception';

export function rpcValidationExceptionFactory(errors: ValidationError[]): RpcValidationException {
  return new RpcValidationException(this.isDetailedOutputDisabled ? undefined : errors);
}
