import React, { useCallback, useMemo } from 'react';
import { dateSetEndOfTheDate } from '../../services/dateTime';
import {
  composeValidators,
  createRequiredValidator,
  minDaysRangeValidator,
  dateDiffValidatorByDays,
  Datepicker,
  IDatepickerProps,
  useFormState,
} from '../forms';

interface IDatepickerToFieldProps extends Partial<IDatepickerProps> {
  name: string
  fromName: string
  maxDaysRange?: number
  minDaysRange?: number
}

export const DatepickerToField: React.FC<IDatepickerToFieldProps> = ({
  name,
  fromName,
  isRequired,
  maxDaysRange,
  minDaysRange,
  label = 'Datepicker To',
  ...restProps
}) => {
  const { values } = useFormState();
  const fromValue = values[fromName];
  const toValue = values[name];

  const handleParse = useCallback((originalValue) => {
    if (!originalValue) {
      return originalValue;
    }

    const endOfDayDate = dateSetEndOfTheDate(originalValue);

    return endOfDayDate.toISOString();
  }, []);

  const validator = useMemo(() => {
    const validators = [];

    if (isRequired) {
      validators.push(createRequiredValidator(label));
    }

    if (maxDaysRange) {
      validators.push(dateDiffValidatorByDays(maxDaysRange, fromValue));
    }

    if (minDaysRange) {
      validators.push(minDaysRangeValidator(minDaysRange, fromValue));
    }

    return composeValidators(...validators);
  }, [
    label,
    isRequired,
    fromValue,
    toValue,
    maxDaysRange,
  ]);

  return (
    <Datepicker
      name={name}
      selectsEnd
      startDate={fromValue}
      endDate={toValue}
      parse={handleParse}
      label={label}
      validate={validator}
      key={fromValue + toValue}
      {...restProps}
    />
  );
};
