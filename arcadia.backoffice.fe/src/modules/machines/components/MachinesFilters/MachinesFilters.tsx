import React from 'react';
import { IModuleFiltersProps, ModuleFilters } from 'arcadia-common-fe';
import { IMachinesFiltersPanelValues } from '../../types';
import { MachinesStatusField } from '../../../../components/fields/MachinesStatusField';
import { IDField } from '../../../../components/fields/IDField';
import { GroupNameField } from '../../../../components/fields/GroupNameField';
import { ObserversCountField } from '../../../../components/fields/ObserversCountField';
import { InQueueCountField } from '../../../../components/fields/InQueueCountField';
import { SiteNameField } from '../../../../components/fields/SiteNameField';
import { MachineNameField } from '../../../../components/fields/MachineNameField';
import { UptimeFromField } from '../../../../components/fields/UptimeFromField';
import { UptimeToField } from '../../../../components/fields/UptimeToField';
import { QueueStatusField } from '../../../../components/fields/QueueStatusField';

interface IMachinesFilterProps extends IModuleFiltersProps<IMachinesFiltersPanelValues> {
}

export const MachinesFilters: React.FC<IMachinesFilterProps> = (props) => (
  <ModuleFilters {...props}>
    <MachinesStatusField />
    <QueueStatusField />
    <IDField label="Machine ID" />
    <MachineNameField name="name" label="Machine name" isMulti />
    <GroupNameField controlType="select" />
    <SiteNameField />
    <ObserversCountField />
    <InQueueCountField />
    <UptimeFromField />
    <UptimeToField />
  </ModuleFilters>
);
