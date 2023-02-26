import React from 'react';
import { ModuleFilters, IModuleFiltersProps, TextField } from 'arcadia-common-fe';
import { useSelector } from 'react-redux';
import { IReportsFiltersPanelValues } from '../../../../types';
import { reportsReducerSelector } from '../../../../state/selectors';
import { ReportsGroupByField } from '../../../../components/ReportsGroupByField/ReportsGroupByField';
import { OperatorIdField } from '../../../../../../components/fields/OperatorIdField';
import { ReportDatepickerFromField } from '../../../../components/ReportDatepickerFromField/ReportDatepickerFromField';
import { ReportDatepickerToField } from '../../../../components/ReportDatepickerToField/ReportDatepickerToField';
import { BlockingReasonField } from '../../../../../../components/fields/BlockingReasonField';

interface IPlayerBlocksReportFiltersProps extends IModuleFiltersProps<IReportsFiltersPanelValues> {
}

export const PlayerBlocksReportFilters: React.FC<IPlayerBlocksReportFiltersProps> = (props) => {
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
      <TextField name="playerId" label="Player ID" />
      <BlockingReasonField name="blockReason" isMulti />
    </ModuleFilters>
  );
};
