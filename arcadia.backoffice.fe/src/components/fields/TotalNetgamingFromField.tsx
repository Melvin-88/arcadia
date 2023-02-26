import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const TotalNetgamingFromField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="totalNetCashFrom"
    label="Total Netgaming From"
    type="number"
  />
);
