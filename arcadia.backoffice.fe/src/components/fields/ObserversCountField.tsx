import React from 'react';
import { TextField, notNegativeDigitValidator, IFormFieldProps } from 'arcadia-common-fe';

export const ObserversCountField: React.FC<IFormFieldProps> = (props) => (
  <TextField
    name="viewers"
    label="Observers"
    type="number"
    validate={notNegativeDigitValidator}
    {...props}
  />
);
