import React from 'react';
import { TextField, notNegativeDigitValidator, IFormFieldProps } from 'arcadia-common-fe';

export const InQueueCountField: React.FC<IFormFieldProps> = (props) => (
  <TextField
    name="inQueue"
    label="In Queue"
    type="number"
    validate={notNegativeDigitValidator}
    {...props}
  />
);
