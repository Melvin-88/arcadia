import React from 'react';
import {
  composeValidators, notNegativeDigitValidator, createFromToValidator, TextField, IFormFieldProps,
} from 'arcadia-common-fe';

const validator = composeValidators(notNegativeDigitValidator, createFromToValidator('netCashFrom', 'netCashTo'));

export const NetgamingToField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="netCashTo"
    label="Netgaming To"
    type="number"
    validate={validator}
  />
);
