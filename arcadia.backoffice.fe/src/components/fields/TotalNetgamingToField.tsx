import React from 'react';
import { createFromToValidator, TextField, IFormFieldProps } from 'arcadia-common-fe';

const validator = createFromToValidator('totalNetCashFrom', 'totalNetCashTo');

export const TotalNetgamingToField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="totalNetCashTo"
    label="Total Netgaming To"
    type="number"
    validate={validator}
  />
);
