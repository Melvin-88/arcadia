import React from 'react';
import { TextField, notNegativeDigitValidator, IFormFieldProps } from 'arcadia-common-fe';

export const NetgamingFromField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="netCashFrom"
    label="Netgaming From"
    type="number"
    validate={notNegativeDigitValidator}
  />
);
