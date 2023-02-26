import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const RebateFromField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="rebateFrom"
    label="Rebate From"
    type="number"
  />
);
