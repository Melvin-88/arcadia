import React from 'react';
import { ITextFieldProps, TextField } from 'arcadia-common-fe';

interface IUptimeFieldProps extends Partial<ITextFieldProps> {
}

export const UptimeField: React.FC<IUptimeFieldProps> = ({
  className, label = 'Uptime', name = 'uptime', ...restProps
}) => (
  <TextField
    className={className}
    name={name}
    label={label}
    type="number"
    placeholder="mm"
    {...restProps}
  />
);
