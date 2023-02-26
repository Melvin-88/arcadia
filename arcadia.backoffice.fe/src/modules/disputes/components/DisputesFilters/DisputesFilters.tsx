import React from 'react';
import {
  PlayerCIDField, IModuleFiltersProps, ModuleFilters, DatepickerFromField, DatepickerToField,
} from 'arcadia-common-fe/dist';
import { IDisputesFiltersPanelValues } from '../../types';
import { DisputesStatusField } from '../../../../components/fields/DisputesStatusField';
import { IDField } from '../../../../components/fields/IDField';
import { OperatorNameField } from '../../../../components/fields/OperatorNameFilter';
import { RebateFromField } from '../../../../components/fields/RebateFromField';
import { RebateToField } from '../../../../components/fields/RebateToField';

interface IMachinesFilterProps extends IModuleFiltersProps<IDisputesFiltersPanelValues> {
}

export const DisputesFilters: React.FC<IMachinesFilterProps> = (props) => (
  <ModuleFilters {...props}>
    <DisputesStatusField />
    <IDField label="Dispute ID" />
    <OperatorNameField />
    <PlayerCIDField />
    <RebateFromField />
    <RebateToField />
    <DatepickerFromField
      label="Opened From"
      name="openedAtDateFrom"
      toName="openedAtDateTo"
    />
    <DatepickerToField
      label="Opened To"
      name="openedAtDateTo"
      fromName="openedAtDateFrom"
    />
    <DatepickerFromField
      label="Closed From"
      name="closedAtDateFrom"
      toName="closedAtDateTo"
    />
    <DatepickerToField
      label="Closed To"
      name="closedAtDateTo"
      fromName="closedAtDateFrom"
    />
  </ModuleFilters>
);
