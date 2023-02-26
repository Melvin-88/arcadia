import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const SourceField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="source"
    label="Source"
  />
);
