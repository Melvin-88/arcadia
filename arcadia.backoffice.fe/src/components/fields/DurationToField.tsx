import React from 'react';
import { createDurationFromToValidator, ITextFieldProps, TextField } from 'arcadia-common-fe';

const validator = createDurationFromToValidator('durationFrom', 'durationTo');

interface IDurationToFieldProps extends Partial<ITextFieldProps>{
}

export const DurationToField: React.FC<IDurationToFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="durationTo"
    label="Duration To"
    validate={validator}
    type="number"
    placeholder="mm"
  />
);
