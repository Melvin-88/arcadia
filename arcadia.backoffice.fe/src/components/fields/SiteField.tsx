import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const SiteField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="site"
    label="Site"
  />
);
