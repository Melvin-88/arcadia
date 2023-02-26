import React from 'react';
import { TextField } from 'arcadia-common-fe';

interface IUptimeFieldProps {
  className?: string
}

export const UptimeField: React.FC<IUptimeFieldProps> = ({ className }) => (
  <TextField
    className={className}
    name="uptime"
    label="Uptime"
    type="number"
    placeholder="mm"
  />
);
