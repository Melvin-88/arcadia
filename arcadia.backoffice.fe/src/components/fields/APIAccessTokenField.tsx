import React, { useMemo } from 'react';
import { createRequiredValidator, ITextFieldProps, TextField } from 'arcadia-common-fe';

interface IAPIAccessTokenFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const APIAccessTokenField: React.FC<IAPIAccessTokenFieldProps> = ({
  label = 'API Access token',
  placeholder = 'API Access token',
  ...restProps
}) => {
  const validator = useMemo(() => (
    createRequiredValidator(label)
  ), [label]);

  return (
    <TextField
      name="apiAccessToken"
      label={label}
      placeholder={placeholder}
      validate={validator}
      {...restProps}
    />
  );
};
