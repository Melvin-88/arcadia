import React, { useMemo } from 'react';
import { createRequiredValidator, ITextFieldProps, TextField } from 'arcadia-common-fe';

interface IAPIConnectorIDFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const APIConnectorIDField: React.FC<IAPIConnectorIDFieldProps> = ({
  label = 'API connector ID',
  placeholder = 'API connector ID',
  ...restProps
}) => {
  const validator = useMemo(() => (
    createRequiredValidator(label)
  ), [label]);

  return (
    <TextField
      name="apiConnectorId"
      label={label}
      placeholder={placeholder}
      validate={validator}
      {...restProps}
    />
  );
};
