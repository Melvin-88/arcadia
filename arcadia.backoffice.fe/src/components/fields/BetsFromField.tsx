import React from 'react';
import { TextField, notNegativeDigitValidator, IFormFieldProps } from 'arcadia-common-fe';

export const BetsFromField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="betsFrom"
    label="Bets From"
    type="number"
    validate={notNegativeDigitValidator}
  />
);
