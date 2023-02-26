import React from 'react';
import {
  composeValidators, notNegativeDigitValidator, createFromToValidator, TextField, IFormFieldProps,
} from 'arcadia-common-fe';

const validator = composeValidators(notNegativeDigitValidator, createFromToValidator('winsFrom', 'winsTo'));

export const WinsToField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="winsTo"
    label="Wins To"
    type="number"
    validate={validator}
  />
);
