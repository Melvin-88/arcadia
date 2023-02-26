import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const TotalWinningFromField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="totalWinningFrom"
    label="Total Winning From"
    type="number"
  />
);
