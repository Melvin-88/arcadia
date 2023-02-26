import React from 'react';
import { ModuleFilters, IModuleFiltersProps } from 'arcadia-common-fe';
import { useSelector } from 'react-redux';
import { IReportsFiltersPanelValues } from '../../../../types';
import { reportsReducerSelector } from '../../../../state/selectors';
import { ReportsGroupByField } from '../../../../components/ReportsGroupByField/ReportsGroupByField';
import { OperatorIdField } from '../../../../../../components/fields/OperatorIdField';
import { DenominatorField } from '../../../../../../components/fields/DenominatorField';
import { ReportDatepickerFromField } from '../../../../components/ReportDatepickerFromField/ReportDatepickerFromField';
import { ReportDatepickerToField } from '../../../../components/ReportDatepickerToField/ReportDatepickerToField';
import { IDField } from '../../../../../../components/fields/IDField';

interface IVouchersReportFiltersProps extends IModuleFiltersProps<IReportsFiltersPanelValues> {
}

export const VouchersReportFilters: React.FC<IVouchersReportFiltersProps> = (props) => {
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
      <DenominatorField name="denomination" />
      <IDField name="playerCid" label="Player ID" />
      <IDField name="voucherId" label="Voucher ID" />
    </ModuleFilters>
  );
};
