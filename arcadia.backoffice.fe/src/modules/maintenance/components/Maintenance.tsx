import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter,
  ITEMS_PER_PAGE,
  useSearchParams,
  useFilter,
  useExport,
  usePagination,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../components/ModuleWrapper/ModuleWrapper';
import { maintenanceReducerSelector } from '../state/selectors';
import { exportMaintenance, getMaintenance } from '../state/actions';
import { MaintenanceTable } from './MaintenanceTable/MaintenanceTable';
import { MaintenanceFilters } from './MaintenanceFilters/MaintenanceFilters';
import { IGetMaintenanceRequestFiltersParams } from '../types';

const Maintenance = () => {
  const dispatch = useDispatch();
  const {
    isLoading, total, alerts, isExporting,
  } = useSelector(maintenanceReducerSelector);

  const searchParams = useSearchParams();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleFiltersSubmit } = useFilter<IGetMaintenanceRequestFiltersParams>();
  const { handleExport } = useExport(total, exportMaintenance);

  useEffect(() => {
    dispatch(getMaintenance({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  return (
    <ModuleWrapper
      commandBar={null}
      filters={(
        <MaintenanceFilters
          total={total}
          isExporting={isExporting}
          isExportDisabled={isLoading}
          initialValues={searchParams}
          onFiltersSubmit={handleFiltersSubmit}
          onExport={handleExport}
        />
      )}
      table={(
        <MaintenanceTable
          total={total}
          offset={offset}
          alerts={alerts}
          isLoading={isLoading}
        />
      )}
      footer={(
        <TableFooter
          total={total}
          itemsPerPage={ITEMS_PER_PAGE}
          paginationProps={{
            forcePage,
            onPageChange: handlePageChange,
          }}
        />
      )}
    />
  );
};

export default Maintenance;
