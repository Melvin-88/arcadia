import React from 'react';
import { notNegativeDigitValidator, TextField, IFormFieldProps } from 'arcadia-common-fe';

export const IdleMachinesField: React.FC<IFormFieldProps> = (props) => (
  <TextField
    name="machinesIdle"
    label="Idle Machines"
    type="number"
    validate={notNegativeDigitValidator}
    {...props}
  />
);
