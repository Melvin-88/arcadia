import React from 'react';
import { Select, IFormFieldProps } from 'arcadia-common-fe';
import { Segment } from '../../modules/monitoring/types';

const options = [
  { label: 'Machines', value: Segment.machine },
  { label: 'Groups', value: Segment.group },
  { label: 'Operators', value: Segment.operator },
  { label: 'System', value: Segment.all },
];

interface IMonitoringSegmentFieldProps extends IFormFieldProps {
  isRequired?: boolean
  isMulti?: boolean
}

export const MonitoringSegmentField: React.FC<IMonitoringSegmentFieldProps> = ({ className, label = 'Segment', ...restProps }) => (
  <Select
    className={className}
    name="segment"
    label={label}
    isClearable
    isMulti
    options={options}
    {...restProps}
  />
);
