import React, { useMemo } from 'react';
import { createRequiredValidator, DateTimePickerField, ITextFieldProps } from 'arcadia-common-fe';

interface IAPIAccessTokenExpirationFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const APIAccessTokenExpirationField: React.FC<IAPIAccessTokenExpirationFieldProps> = ({
  label = 'API Access token',
  placeholder = 'DD/MM/YYYY, hh:mm',
  ...restProps
}) => {
  const validator = useMemo(() => (
    createRequiredValidator(label)
  ), [label]);

  return (
    <DateTimePickerField
      label={label}
      name="apiTokenExpirationDate"
      placeholderText={placeholder}
      validate={validator}
      {...restProps}
    />
  );
};
