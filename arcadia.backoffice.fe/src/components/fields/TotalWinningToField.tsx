import React from 'react';
import { createFromToValidator, TextField, IFormFieldProps } from 'arcadia-common-fe';

const validator = createFromToValidator('totalWinningFrom', 'totalWinningTo');

export const TotalWinningToField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="totalWinningTo"
    label="Total Winning To"
    type="number"
    validate={validator}
  />
);
