import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { MonitoringStatus } from '../../modules/monitoring/types';
import { monitoringStatusLabelMap } from '../../modules/monitoring/constants';

const options: ISelectOptions<MonitoringStatus> = Object.values(MonitoringStatus).map((key) => (
  { value: key, label: monitoringStatusLabelMap[key] }
));

interface IMonitoringStatusFieldProps extends IFormFieldProps {
  isRequired?: boolean
}

export const MonitoringStatusField: React.FC<IMonitoringStatusFieldProps> = ({ label = 'Status', ...restProps }) => (
  <Select
    name="status"
    label={label}
    isClearable
    options={options}
    {...restProps}
  />
);
