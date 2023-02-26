import React from 'react';
import { TextField, notNegativeDigitValidator, IFormFieldProps } from 'arcadia-common-fe';

export const TotalMachinesField: React.FC<IFormFieldProps> = (props) => (
  <TextField
    name="machinesTotal"
    label="Total Machines"
    type="number"
    validate={notNegativeDigitValidator}
    {...props}
  />
);
