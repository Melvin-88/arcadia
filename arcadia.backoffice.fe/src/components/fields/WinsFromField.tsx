import React from 'react';
import { TextField, notNegativeDigitValidator, IFormFieldProps } from 'arcadia-common-fe';

export const WinsFromField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="winsFrom"
    label="Wins From"
    type="number"
    validate={notNegativeDigitValidator}
  />
);
