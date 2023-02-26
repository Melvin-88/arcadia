import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const RoundsFromField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="roundsFrom"
    label="Rounds From"
    type="number"
  />
);
