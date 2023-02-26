import React from 'react';
import { ITextFieldProps } from 'arcadia-common-fe';
import { TimeoutField } from './common/TimeoutField';

interface IGraceTimeoutFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const GraceTimeoutField: React.FC<IGraceTimeoutFieldProps> = ({
  label = 'Grace Timeout',
  placeholder = 'Grace Timeout',
  ...props
}) => (
  <TimeoutField
    name="graceTimeout"
    label={label}
    placeholder={placeholder}
    {...props}
  />
);
