import React, { useMemo } from 'react';
import {
  composeValidators,
  createRequiredValidator,
  maxTimeframeValidator,
  DateTimePickerField,
  IDateTimePickerFieldProps,
  useFormState,
} from '../forms';

interface IDateTimePickerToFieldProps extends Partial<IDateTimePickerFieldProps> {
  name: string
  fromName: string
  isRequired?: boolean
  maxTimeframeMS?: number
}

export const DateTimePickerToField: React.FC<IDateTimePickerToFieldProps> = ({
  name,
  label = '',
  placeholder = 'DD/MM/YYYY, hh:mm',
  fromName,
  isRequired,
  maxTimeframeMS = 600000,
  ...restProps
}) => {
  const { values } = useFormState();
  const fromValue = values[fromName];
  const toValue = values[name];

  const validator = useMemo(() => {
    const validators = [];

    if (isRequired) {
      validators.push(createRequiredValidator(label));
    }

    validators.push(
      maxTimeframeValidator(fromName, name, maxTimeframeMS),
    );

    return composeValidators(...validators);
  }, [label, isRequired, maxTimeframeMS]);

  return (
    <DateTimePickerField
      name={name}
      label={label}
      placeholder={placeholder}
      selectsEnd
      startDate={fromValue}
      endDate={toValue}
      validate={validator}
      {...restProps}
    />
  );
};
