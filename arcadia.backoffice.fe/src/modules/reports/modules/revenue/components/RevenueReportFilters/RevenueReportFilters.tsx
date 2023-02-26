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

interface IRevenueReportFiltersProps extends IModuleFiltersProps<IReportsFiltersPanelValues> {
}

export const RevenueReportFilters: React.FC<IRevenueReportFiltersProps> = (props) => {
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
      <GroupNameField controlType="select" />
      <MachineIDField />
      <DenominatorField name="denomination" />
    </ModuleFilters>
  );
};
