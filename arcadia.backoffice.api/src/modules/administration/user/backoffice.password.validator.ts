import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidBackofficePassword(validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isValidBackofficePassword',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value && typeof value === 'string'
            && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_\-`]).{8,}$/.test(value)
            && value.length && value.length < 129;
        },
        defaultMessage(): string {
          return '$property must include at least one lowercase, one uppercase character, one number and one of !?`';
        },
      },
    });
  };
}
