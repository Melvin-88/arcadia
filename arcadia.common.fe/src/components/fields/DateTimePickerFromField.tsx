import React, { useMemo } from 'react';
import {
  composeValidators,
  createRequiredValidator,
  dateDifferenceValidator,
  DateTimePickerField,
  IDateTimePickerFieldProps,
  useFormState,
} from '../forms';

interface IDateTimePickerFromFieldProps extends Partial<IDateTimePickerFieldProps> {
  name: string
  toName: string
  isRequired?: boolean
}

export const DateTimePickerFromField: React.FC<IDateTimePickerFromFieldProps> = ({
  name,
  label = '',
  placeholder = 'DD/MM/YYYY, hh:mm',
  toName,
  isRequired,
  ...restProps
}) => {
  const { values } = useFormState();
  const value = values[name];
  const toValue = values[toName];

  const validator = useMemo(() => {
    const validators = [];

    if (isRequired) {
      validators.push(createRequiredValidator(label));
    }

    validators.push(
      dateDifferenceValidator(name, toName),
    );

    return composeValidators(...validators);
  }, [label, isRequired, name, toName]);

  return (
    <DateTimePickerField
      name={name}
      selectsStart
      label={label}
      placeholder={placeholder}
      startDate={value}
      endDate={toValue}
      validate={validator}
      {...restProps}
    />
  );
};
