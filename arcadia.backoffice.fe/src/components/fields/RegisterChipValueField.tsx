import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const RegisterChipValueField: React.FC<IFormFieldProps> = ({ className, label = 'Type' }) => (
  <TextField
    className={className}
    name="value"
    label={label}
    type="number"
  />
);
