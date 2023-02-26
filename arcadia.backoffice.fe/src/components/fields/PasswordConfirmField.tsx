import React, { useMemo } from 'react';
import {
  composeValidators, createRequiredValidator, validatePasswordConfirm, ITextFieldProps, TextField,
} from 'arcadia-common-fe';

interface IPasswordConfirmFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const PasswordConfirmField: React.FC<IPasswordConfirmFieldProps> = ({
  label = 'Password ',
  name = 'passwordConfirm',
  placeholder = 'Password Confirm',
  ...restProps
}) => {
  const validator = useMemo(() => (
    composeValidators(createRequiredValidator(label || 'Password confirm'), validatePasswordConfirm)
  ), [label]);

  return (
    <TextField
      name={name}
      type="password"
      label={label}
      placeholder={placeholder}
      validate={validator}
      {...restProps}
    />
  );
};
