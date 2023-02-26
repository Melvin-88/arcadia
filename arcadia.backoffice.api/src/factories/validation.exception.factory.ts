import { ValidationError } from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';

function getErrorMessages(errors: ValidationError[]): string[] {
  let messages = [];
  errors.forEach(m => {
    if (m.constraints) {
      messages = messages.concat(Object.values(m.constraints));
    }
    if (m.children) {
      messages = messages.concat(getErrorMessages(m.children));
    }
  });

  return messages;
}

export function validationExceptionFactory(errors: ValidationError[]): ValidationException {
  const messages = getErrorMessages(errors);
  return new ValidationException(messages);
}
