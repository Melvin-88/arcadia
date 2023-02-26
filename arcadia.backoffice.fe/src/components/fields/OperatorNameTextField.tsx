import React, { useMemo } from 'react';
import { createRequiredValidator, ITextFieldProps, TextField } from 'arcadia-common-fe';

interface IOperatorNameFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const OperatorNameTextField: React.FC<IOperatorNameFieldProps> = ({
  label = 'Operator Name',
  placeholder = 'Operator Name',
  ...restProps
}) => {
  const validator = useMemo(() => (
    createRequiredValidator(label)
  ), [label]);

  return (
    <TextField
      name="name"
      label={label}
      placeholder={placeholder}
      validate={validator}
      {...restProps}
    />
  );
};
