import React, { useCallback, useMemo } from 'react';
import {
  composeValidators,
  createRequiredValidator,
  notNegativeDigitValidator,
  TextField,
  ITextFieldProps,
} from 'arcadia-common-fe';

interface ITimeoutFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const TimeoutField: React.FC<ITimeoutFieldProps> = ({ label = 'Timeout', placeholder = 'Timeout', ...restProps }) => {
  const validator = useMemo(() => (
    composeValidators(createRequiredValidator(label), notNegativeDigitValidator)
  ), [label]);

  const handleParse = useCallback((value: string) => (
    value ? Number.parseFloat(value) : undefined
  ), []);

  return (
    <TextField
      name="timeout"
      type="number"
      label={label}
      placeholder={placeholder}
      validate={validator}
      parse={handleParse}
      {...restProps}
    />
  );
};
