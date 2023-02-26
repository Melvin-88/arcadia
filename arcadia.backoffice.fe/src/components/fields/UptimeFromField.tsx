import React from 'react';
import { UptimeField } from './common/UptimeField';

interface IUptimeFromFieldProps {
  className?: string
}

export const UptimeFromField: React.FC<IUptimeFromFieldProps> = ({ className }) => (
  <UptimeField
    className={className}
    name="uptimeFrom"
    label="Uptime From"
  />
);
