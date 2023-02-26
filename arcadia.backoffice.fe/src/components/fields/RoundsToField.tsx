import React from 'react';
import { createFromToValidator, TextField, IFormFieldProps } from 'arcadia-common-fe';

const validator = createFromToValidator('roundsFrom', 'roundsTo');

export const RoundsToField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="roundsTo"
    label="Rounds To"
    type="number"
    validate={validator}
  />
);
