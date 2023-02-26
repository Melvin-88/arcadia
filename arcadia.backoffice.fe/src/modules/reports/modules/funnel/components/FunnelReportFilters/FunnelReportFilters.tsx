import React from 'react';
import { ModuleFilters, IModuleFiltersProps } from 'arcadia-common-fe';
import { useSelector } from 'react-redux';
import { IReportsFiltersPanelValues } from '../../../../types';
import { reportsReducerSelector } from '../../../../state/selectors';
import { ReportsGroupByField } from '../../../../components/ReportsGroupByField/ReportsGroupByField';
import { OperatorIdField } from '../../../../../../components/fields/OperatorIdField';
import { DenominatorField } from '../../../../../../components/fields/DenominatorField';
import { GroupNameField } from '../../../../../../components/fields/GroupNameField';
import { SiteIDField } from '../../../../../../components/fields/SiteIDField';
import { MachineIDField } from '../../../../../../components/fields/MachineIDField';
import { ReportDatepickerFromField } from '../../../../components/ReportDatepickerFromField/ReportDatepickerFromField';
import { ReportDatepickerToField } from '../../../../components/ReportDatepickerToField/ReportDatepickerToField';
import { NewPlayersOnlyField } from './NewPlayersOnlyField/NewPlayersOnlyField';

interface IFunnelReportFiltersProps extends IModuleFiltersProps<IReportsFiltersPanelValues> {
}

export const FunnelReportFilters: React.FC<IFunnelReportFiltersProps> = (props) => {
  const { reportType } = useSelector(reportsReducerSelector);

  return (
    <ModuleFilters
      submitText="Get reports"
      {...props}
    >
      <ReportDatepickerFromField />
      <ReportDatepickerToField />
      <ReportsGroupByField reportType={reportType} isRequired />
      <OperatorIdField />
      <SiteIDField />
      <NewPlayersOnlyField />
      <GroupNameField controlType="select" />
      <MachineIDField />
      <DenominatorField name="denomination" />
    </ModuleFilters>
  );
};
