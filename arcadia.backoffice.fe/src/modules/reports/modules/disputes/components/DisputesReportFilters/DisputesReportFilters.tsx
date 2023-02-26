import React from 'react';
import { ModuleFilters, IModuleFiltersProps, TextField } from 'arcadia-common-fe';
import { useSelector } from 'react-redux';
import { IReportsFiltersPanelValues } from '../../../../types';
import { reportsReducerSelector } from '../../../../state/selectors';
import { ReportsGroupByField } from '../../../../components/ReportsGroupByField/ReportsGroupByField';
import { OperatorIdField } from '../../../../../../components/fields/OperatorIdField';
import { DisputesStatusField } from '../../../../../../components/fields/DisputesStatusField';
import { DisputesReportStateField } from './DisputesReportState/DisputesReportState';
import { ReportDatepickerFromField } from '../../../../components/ReportDatepickerFromField/ReportDatepickerFromField';
import { ReportDatepickerToField } from '../../../../components/ReportDatepickerToField/ReportDatepickerToField';

interface IDisputesReportFiltersProps extends IModuleFiltersProps<IReportsFiltersPanelValues> {
}

export const DisputesReportFilters: React.FC<IDisputesReportFiltersProps> = (props) => {
  const { reportType } = useSelector(reportsReducerSelector);

  return (
    <ModuleFilters
      submitText="Get reports"
      {...props}
    >
      <ReportDatepickerFromField />
      <ReportDatepickerToField />
      <ReportsGroupByField reportType={reportType} isRequired />
      <DisputesReportStateField label="Open/Close date" isClearable={false} isRequired />
      <OperatorIdField />
      <TextField name="playerCid" label="Player ID" />
      <DisputesStatusField isMulti label="Status" />
    </ModuleFilters>
  );
};
