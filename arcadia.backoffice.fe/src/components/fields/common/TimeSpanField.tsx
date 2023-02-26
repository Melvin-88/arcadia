import React from 'react';
import { TimeSpanFormat, IFormFieldProps } from 'arcadia-common-fe';
import { DurationField } from './DurationField';

export const TimeSpanField: React.FC<IFormFieldProps> = ({
  name = 'duration',
  label = 'Duration',
  ...restProps
}) => (
  <DurationField
    name={name}
    label={label}
    timeSpanFormat={TimeSpanFormat.HHmmss}
    {...restProps}
  />
);
