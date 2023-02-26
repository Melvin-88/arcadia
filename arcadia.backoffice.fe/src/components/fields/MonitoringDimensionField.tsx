import React from 'react';
import { ISelectProps, IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface IMonitoringDimensionFieldProps extends IFormFieldProps, Partial<ISelectProps> {
}

export const MonitoringDimensionField: React.FC<IMonitoringDimensionFieldProps> = ({
  className,
  label = 'Dimension',
  ...restProps
}) => (
  <SelectEntityByType
    className={className}
    name="dimension"
    label={label}
    entityType={EntityType.monitoringDimension}
    {...restProps}
  />
);
