import React from 'react';
import {
  composeValidators, notNegativeDigitValidator, createFromToValidator, TextField, IFormFieldProps,
} from 'arcadia-common-fe';

const validator = composeValidators(notNegativeDigitValidator, createFromToValidator('betsFrom', 'betsTo'));

export const BetsToField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="betsTo"
    label="Bets To"
    type="number"
    validate={validator}
  />
);
