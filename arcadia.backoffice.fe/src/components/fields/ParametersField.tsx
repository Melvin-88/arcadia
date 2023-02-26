import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const ParametersField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="parameters"
    label="Parameters"
  />
);
