import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const IDField: React.FC<IFormFieldProps> = ({
  className, name = 'id', label = 'ID', ...restProps
}) => (
  <TextField
    className={className}
    name={name}
    label={label}
    {...restProps}
  />
);
