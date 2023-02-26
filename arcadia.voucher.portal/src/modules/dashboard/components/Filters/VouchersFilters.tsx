import React from 'react';
import {
  PlayerCIDField,
  VouchersStatusField,
  ModuleFilters,
  useFilter,
  useExport,
  DatepickerFromField,
  DatepickerToField,
  useSearchParams,
} from 'arcadia-common-fe';
import { useSelector } from 'react-redux';
import { dashboardReducerSelector } from '../../state/selectors';
import { exportVouchers } from '../../state/actions';
import { GroupNameField } from '../../../../components/fields/GroupNameField';
import './Filters.scss';

interface IVouchersFiltersProps {
}

export const VouchersFilters: React.FC<IVouchersFiltersProps> = () => {
  const { handleFiltersSubmit } = useFilter();
  const searchParams = useSearchParams();
  const {
    total, isVouchersLoading, isVouchersExporting,
  } = useSelector(dashboardReducerSelector);

  const { handleExport } = useExport(total, exportVouchers);

  return (
    <ModuleFilters
      className="vouchers-filters"
      total={total}
      initialValues={searchParams}
      isExportDisabled={isVouchersLoading}
      isExporting={isVouchersExporting}
      onFiltersSubmit={handleFiltersSubmit}
      onExport={handleExport}
    >
      <PlayerCIDField />
      <VouchersStatusField />
      <GroupNameField controlType="select" isMulti={false} />
      <DatepickerFromField
        label="Date From"
        name="expirationDateFrom"
        toName="expirationDateTo"
      />
      <DatepickerToField
        label="Date To"
        name="expirationDateTo"
        fromName="expirationDateFrom"
      />
    </ModuleFilters>
  );
};
