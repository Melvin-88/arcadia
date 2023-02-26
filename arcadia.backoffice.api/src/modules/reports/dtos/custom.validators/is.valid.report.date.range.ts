import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import * as moment from 'moment';

export function IsValidReportDateRange(validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isValidReportDateRange',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj: any = args.object;

          if (!moment(obj.startDate).isValid() || !moment(obj.endDate).isValid()
            || moment(obj.endDate).isBefore(obj.startDate)
            || moment(obj.endDate).isSameOrAfter(moment().startOf('day'))
            || moment(obj.endDate).diff(obj.startDate, 'days') >= 94) {
            return false;
          }

          return true;
        },
        defaultMessage(): string {
          return 'Date range should be not longer than 3 month and should not include current day or days in the future';
        },
      },
    });
  };
}
