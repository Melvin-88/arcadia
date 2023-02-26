import React from 'react';
import {
  IModuleFiltersProps, ModuleFilters, DatepickerFromField, DatepickerToField,
} from 'arcadia-common-fe';
import { IAlertsFiltersPanelValues } from '../../types';
import { AlertsStatusField } from '../../../../components/fields/AlertsStatusField';
import { SourceField } from '../../../../components/fields/SourceField';
import { DescriptionField } from '../../../../components/fields/DescriptionField';
import { AlertsSeverityField } from '../../../../components/fields/AlertsSeverityField';
import { AlertTypeField } from '../../../../components/fields/AlertsTypeField';
import { IsFlaggedField } from '../../../../components/fields/IsFlaggedField';

interface IMachinesFilterProps extends IModuleFiltersProps<IAlertsFiltersPanelValues> {
}

export const AlertsFilters: React.FC<IMachinesFilterProps> = (props) => (
  <ModuleFilters {...props}>
    <AlertsStatusField />
    <DescriptionField />
    <AlertTypeField />
    <AlertsSeverityField />
    <SourceField />
    <IsFlaggedField />
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
