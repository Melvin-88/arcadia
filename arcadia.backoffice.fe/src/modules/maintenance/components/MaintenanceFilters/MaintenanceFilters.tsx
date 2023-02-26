import React from 'react';
import {
  IModuleFiltersProps, ModuleFilters, DatepickerFromField, DatepickerToField,
} from 'arcadia-common-fe';
import { IMaintenanceFiltersPanelValues } from '../../types';
import { AlertTypeField } from '../../../../components/fields/AlertsTypeField';
import { AlertsSeverityField } from '../../../../components/fields/AlertsSeverityField';
import { SourceField } from '../../../../components/fields/SourceField';
import { DescriptionField } from '../../../../components/fields/DescriptionField';

interface IMaintenanceFiltersProps extends IModuleFiltersProps<IMaintenanceFiltersPanelValues> {
}

export const MaintenanceFilters: React.FC<IMaintenanceFiltersProps> = (props) => (
  <ModuleFilters {...props}>
    <AlertTypeField />
    <SourceField />
    <AlertsSeverityField />
    <DescriptionField />
    <DatepickerFromField
      label="Date From"
      name="dateFrom"
      toName="dateTo"
    />
    <DatepickerToField
      label="Date To"
      name="dateTo"
      fromName="dateFrom"
    />
  </ModuleFilters>
);
