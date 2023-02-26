import React from 'react';
import { TextField, notNegativeDigitValidator, IFormFieldProps } from 'arcadia-common-fe';

export const MonitoringCurrentValueFromField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="currentValueFrom"
    label="Current Value From"
    type="number"
    validate={notNegativeDigitValidator}
  />
);
