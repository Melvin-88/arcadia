import React from 'react';
import { createFromToValidator, TextField, IFormFieldProps } from 'arcadia-common-fe';

const validator = createFromToValidator('rebateFrom', 'rebateTo');

export const RebateToField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="rebateTo"
    label="Rebate To"
    type="number"
    validate={validator}
  />
);
