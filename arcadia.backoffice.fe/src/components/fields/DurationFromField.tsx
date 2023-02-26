import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const DurationFromField: React.FC<IFormFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="durationFrom"
    label="Duration From"
    type="number"
    placeholder="mm"
  />
);
