import React, { useCallback, useEffect, useMemo } from 'react';
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
import { monitoringReducerSelector } from '../state/selectors';
import { exportMonitoring, getMonitoring } from '../state/actions';
import { MonitoringTable } from './MonitoringTable/MonitoringTable';
import { MonitoringFilters } from './MonitoringFilters/MonitoringFilters';
import { IGetMonitoringRequestFilterParams } from '../types';
import { MonitoringCommandBar } from './MonitoringCommandBar/MonitoringCommandBar';
import { checkFiltersSubsets, groupFiltersSubsets } from '../helpers';
import { MonitoringDialogForm } from './MonitoringDialogForm/MonitoringDialogForm';

const Monitoring = () => {
  const dispatch = useDispatch();
  const {
    isLoading, total, monitoring, isExporting,
  } = useSelector(monitoringReducerSelector);
  const searchParams = useSearchParams();
  const { handleExport } = useExport(total, exportMonitoring);
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleFiltersSubmit } = useFilter<IGetMonitoringRequestFilterParams>();

  const handleFiltersSubmitForm = useCallback((data) => {
    let filtersSubsets = {};
    let newFiltersOptions = { ...data };
    const { segmentSubset } = data;

    if (segmentSubset) {
      filtersSubsets = groupFiltersSubsets(segmentSubset);
      delete newFiltersOptions.segmentSubset;
    }

    newFiltersOptions = { ...newFiltersOptions, ...filtersSubsets };
    handleFiltersSubmit(newFiltersOptions);
  }, []);

  const initialValuesForm = useMemo(() => checkFiltersSubsets(searchParams), [searchParams]);

  useEffect(() => {
    dispatch(getMonitoring({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  return (
    <>
      <ModuleWrapper
        commandBar={(
          <MonitoringCommandBar />
        )}
        filters={(
          <MonitoringFilters
            total={total}
            isExporting={isExporting}
            isExportDisabled={isLoading}
            initialValues={initialValuesForm}
            onFiltersSubmit={handleFiltersSubmitForm}
            onExport={handleExport}
          />
        )}
        table={(
          <MonitoringTable
            total={total}
            offset={offset}
            monitoring={monitoring}
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
      <MonitoringDialogForm />
    </>
  );
};

export default Monitoring;
