import React, { useMemo } from 'react';
import {
  composeValidators, createRequiredValidator, validateEmail, ITextFieldProps, TextField,
} from 'arcadia-common-fe';

interface IEmailFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const EmailField: React.FC<IEmailFieldProps> = ({ label = 'Email', placeholder = 'Email', ...restProps }) => {
  const validator = useMemo(() => (
    composeValidators(createRequiredValidator(label), validateEmail)
  ), [label]);

  return (
    <TextField
      name="email"
      label={label}
      placeholder={placeholder}
      validate={validator}
      {...restProps}
    />
  );
};
