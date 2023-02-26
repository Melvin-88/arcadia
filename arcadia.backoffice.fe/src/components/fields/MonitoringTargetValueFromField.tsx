import React from 'react';
import { TextField, notNegativeDigitValidator, IFormFieldProps } from 'arcadia-common-fe';

export const MonitoringTargetValueFromField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="targetValueFrom"
    label="Target Value From"
    type="number"
    validate={notNegativeDigitValidator}
  />
);
