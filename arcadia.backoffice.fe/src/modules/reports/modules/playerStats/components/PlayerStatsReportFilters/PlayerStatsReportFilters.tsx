import React from 'react';
import { ModuleFilters, IModuleFiltersProps, TextField } from 'arcadia-common-fe';
import { IReportsFiltersPanelValues } from '../../../../types';
import { OperatorIdField } from '../../../../../../components/fields/OperatorIdField';
import { DenominatorField } from '../../../../../../components/fields/DenominatorField';
import { GroupNameField } from '../../../../../../components/fields/GroupNameField';
import { SiteIDField } from '../../../../../../components/fields/SiteIDField';
import { MachineIDField } from '../../../../../../components/fields/MachineIDField';
import { ReportDatepickerFromField } from '../../../../components/ReportDatepickerFromField/ReportDatepickerFromField';
import { ReportDatepickerToField } from '../../../../components/ReportDatepickerToField/ReportDatepickerToField';

interface IPlayerStatsReportFiltersProps extends IModuleFiltersProps<IReportsFiltersPanelValues> {
}

export const PlayerStatsReportFilters: React.FC<IPlayerStatsReportFiltersProps> = (props) => (
  <ModuleFilters
    submitText="Get reports"
    {...props}
  >
    <ReportDatepickerFromField />
    <ReportDatepickerToField />
    <OperatorIdField />
    <SiteIDField />
    <GroupNameField controlType="select" />
    <MachineIDField />
    <DenominatorField name="denomination" />
    <TextField name="playerId" label="Player ID" />
    <TextField name="sessionId" label="Session ID" />
  </ModuleFilters>
);
