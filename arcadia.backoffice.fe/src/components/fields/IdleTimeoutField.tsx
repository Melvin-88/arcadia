import React from 'react';
import { ITextFieldProps } from 'arcadia-common-fe';
import { TimeoutField } from './common/TimeoutField';

interface IIdleTimeoutFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const IdleTimeoutField: React.FC<IIdleTimeoutFieldProps> = ({ label = 'Idle Timeout', placeholder = 'Idle Timeout', ...props }) => (
  <TimeoutField
    name="idleTimeout"
    label={label}
    placeholder={placeholder}
    {...props}
  />
);
