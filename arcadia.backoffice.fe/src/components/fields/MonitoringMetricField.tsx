import React from 'react';
import { ISelectProps, IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface IMonitoringMetricFieldProps extends IFormFieldProps, Partial<ISelectProps> {
}

export const MonitoringMetricField: React.FC<IMonitoringMetricFieldProps> = ({
  className,
  label = 'Metric',
  ...restProps
}) => (
  <SelectEntityByType
    className={className}
    name="metric"
    label={label}
    entityType={EntityType.monitoringMetric}
    {...restProps}
  />
);
