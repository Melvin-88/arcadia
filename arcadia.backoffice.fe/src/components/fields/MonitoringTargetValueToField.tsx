import React from 'react';
import {
  TextField, composeValidators, createFromToValidator, notNegativeDigitValidator, IFormFieldProps,
} from 'arcadia-common-fe';

const validator = composeValidators(notNegativeDigitValidator, createFromToValidator('targetValueFrom', 'targetValueTo'));

export const MonitoringTargetValueToField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="targetValueTo"
    label="Target Value To"
    type="number"
    validate={validator}
  />
);
