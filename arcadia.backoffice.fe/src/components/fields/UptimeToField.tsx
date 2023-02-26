import React from 'react';
import { createDurationFromToValidator } from 'arcadia-common-fe';
import { UptimeField } from './common/UptimeField';

const validator = createDurationFromToValidator('uptimeFrom', 'uptimeTo');

interface IUptimeToFieldProps {
  className?: string
}

export const UptimeToField: React.FC<IUptimeToFieldProps> = ({ className }) => (
  <UptimeField
    className={className}
    name="uptimeTo"
    label="Uptime To"
    validate={validator}
  />
);
