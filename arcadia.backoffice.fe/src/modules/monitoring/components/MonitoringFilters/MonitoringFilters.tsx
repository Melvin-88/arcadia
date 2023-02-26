import React from 'react';
import { IModuleFiltersProps, ModuleFilters } from 'arcadia-common-fe';
import { IMonitoringFiltersPanelValues } from '../../types';
import { MonitoringStatusField } from '../../../../components/fields/MonitoringStatusField';
import { MonitoringSegmentField } from '../../../../components/fields/MonitoringSegmentField';
import { MonitoringModeField } from '../../../../components/fields/MonitoringModeField';
import { MonitoringMetricField } from '../../../../components/fields/MonitoringMetricField';
import { MonitoringDimensionField } from '../../../../components/fields/MonitoringDimensionField';
import { MonitoringTargetValueFromField } from '../../../../components/fields/MonitoringTargetValueFromField';
import { MonitoringTargetValueToField } from '../../../../components/fields/MonitoringTargetValueToField';
import { MonitoringCurrentValueFromField } from '../../../../components/fields/MonitoringCurrentValueFromField';
import { MonitoringCurrentValueToField } from '../../../../components/fields/MonitoringCurrentValueToField';
import { MonitoringSegmentSubsetFilter } from '../MonitoringSegmentSubsetFilter/MonitoringSegmentSubsetFilter';

interface IMonitoringFiltersProps extends IModuleFiltersProps<IMonitoringFiltersPanelValues> {
}

export const MonitoringFilters: React.FC<IMonitoringFiltersProps> = (props) => (
  <ModuleFilters {...props}>
    <MonitoringStatusField />
    <MonitoringSegmentField />
    <MonitoringSegmentSubsetFilter />
    <MonitoringModeField />
    <MonitoringMetricField />
    <MonitoringDimensionField />
    <MonitoringTargetValueFromField />
    <MonitoringTargetValueToField />
    <MonitoringCurrentValueFromField />
    <MonitoringCurrentValueToField />
  </ModuleFilters>
);
