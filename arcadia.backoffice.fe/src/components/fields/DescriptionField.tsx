import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const DescriptionField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="description"
    label="Description"
  />
);
