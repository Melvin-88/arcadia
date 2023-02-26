import React, { useMemo } from 'react';
import {
  composeValidators,
  createRequiredValidator,
  dateDifferenceValidator,
  Datepicker,
  IDatepickerProps,
  ITextFieldProps,
  useFormState,
} from '../forms';

interface IFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

interface IDatePickerFromFieldProps extends Partial<IDatepickerProps>, IFieldProps {
  name: string
  toName: string
}

export const DatepickerFromField: React.FC<IDatePickerFromFieldProps> = ({
  name, toName, label = 'Datepicker From', isRequired, ...restProps
}) => {
  const { values } = useFormState();
  const value = values[name];
  const toValue = values[toName];

  const validator = useMemo(() => (
    composeValidators(
      isRequired ? createRequiredValidator(label) : () => undefined,
      dateDifferenceValidator(name, toName),
    )
  ), [label]);

  return (
    <Datepicker
      name={name}
      selectsStart
      startDate={value}
      endDate={toValue}
      label={label}
      validate={validator}
      {...restProps}
    />
  );
};
