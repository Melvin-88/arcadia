import React, { useMemo } from 'react';
import { FieldValidator } from 'final-form';
import {
  composeValidators, createRequiredValidator, ITextFieldProps, TextField, validatePassword,
} from '../forms';

interface IFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

interface IPasswordFieldProps extends IFieldProps {
  withSymbolsValidation?: boolean
}

export const PasswordField: React.FC<IPasswordFieldProps> = ({
  label = 'Password',
  name = 'password',
  placeholder = 'Password',
  withSymbolsValidation = true,
  isRequired = true,
  ...restProps
}) => {
  const validator = useMemo(() => {
    const validators: FieldValidator<string>[] = [];

    if (isRequired) {
      validators.push(createRequiredValidator(label));
    }

    if (withSymbolsValidation) {
      validators.push(validatePassword);
    }

    return composeValidators(...validators);
  }, [withSymbolsValidation, label, isRequired]);

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
