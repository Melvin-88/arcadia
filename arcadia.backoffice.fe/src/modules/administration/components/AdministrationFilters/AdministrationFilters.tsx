import React from 'react';
import {
  UserNameField, IModuleFiltersProps, ModuleFilters, DatepickerToField, DatepickerFromField,
} from 'arcadia-common-fe';
import { IAdministrationFiltersPanelValues } from '../../types';
import { AdministrationStatusField } from '../../../../components/fields/AdministrationStatusField';
import { IDField } from '../../../../components/fields/IDField';
import { IsAdminField } from '../../../../components/fields/IsAdminField';
import { IPField } from '../../../../components/fields/IPField';

interface IAdministrationFiltersProps extends IModuleFiltersProps<IAdministrationFiltersPanelValues> {
}

export const AdministrationFilters: React.FC<IAdministrationFiltersProps> = (props) => (
  <ModuleFilters {...props}>
    <AdministrationStatusField />
    <IDField label="User ID" />
    <IsAdminField />
    <UserNameField />
    <DatepickerToField
      label="Last Access To"
      name="lastAccessDateTo"
      fromName="lastAccessDateFrom"
    />
    <DatepickerFromField
      label="Last Access From"
      name="lastAccessDateFrom"
      toName="lastAccessDateTo"
    />
    <IPField label="Last Access IP" name="lastAccessIp" />
  </ModuleFilters>
);
