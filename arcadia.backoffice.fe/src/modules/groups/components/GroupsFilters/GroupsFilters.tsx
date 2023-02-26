import React from 'react';
import { IModuleFiltersProps, ModuleFilters } from 'arcadia-common-fe';
import { IGroupsFiltersPanelValues } from '../../types';
import { GroupsStatusField } from '../../../../components/fields/GroupsStatusField';
import { TotalMachinesField } from '../../../../components/fields/TotalMachinesField';
import { IdleMachinesField } from '../../../../components/fields/IdleMachinesField';
import { DenominatorField } from '../../../../components/fields/DenominatorField';
import { HasJackpotField } from '../../../../components/fields/HasJackpotField';
import { OperatorsField } from '../../../../components/fields/OperatorsField';
import { GroupNameField } from '../../../../components/fields/GroupNameField';

interface IGroupsFilterProps extends IModuleFiltersProps<IGroupsFiltersPanelValues> {
}

export const GroupsFilters: React.FC<IGroupsFilterProps> = (props) => (
  <ModuleFilters {...props}>
    <GroupsStatusField />
    <GroupNameField name="name" />
    <TotalMachinesField />
    <IdleMachinesField />
    <DenominatorField />
    <HasJackpotField />
    <OperatorsField />
  </ModuleFilters>
);
