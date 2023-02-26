import React from 'react';
import {
  TextField, composeValidators, createFromToValidator, notNegativeDigitValidator, IFormFieldProps,
} from 'arcadia-common-fe';

const validator = composeValidators(notNegativeDigitValidator, createFromToValidator('currentValueFrom', 'currentValueTo'));

export const MonitoringCurrentValueToField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="currentValueTo"
    label="Current Value To"
    type="number"
    validate={validator}
  />
);
