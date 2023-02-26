import React, { useCallback, useEffect } from 'react';
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
import { AlertsTable } from './AlertsTable/AlertsTable';
import { checkAlertsToRefresh, exportAlerts, getAlerts } from '../state/actions';
import { alertsReducerSelector } from '../state/selectors';
import { IGetAlertsRequestFiltersParams } from '../types';
import { AlertsFilters } from './AlertsFilters/AlertsFilters';
import { AlertsCommandBar } from './AlertsCommandBar/AlertsCommandBar';
import { AlertsDismissDialog } from './AlertsTable/AlertsDismissDialog/AlertsDismissDialog';
import { ALERTS_UPDATE_INTERVAL } from '../../../constants';

const Alerts = () => {
  const dispatch = useDispatch();
  const {
    isLoading, isExporting, total, ids, entities,
  } = useSelector(alertsReducerSelector);
  const searchParams = useSearchParams();

  const { handleFiltersSubmit } = useFilter<IGetAlertsRequestFiltersParams>();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleExport } = useExport(total, exportAlerts);

  const handleGetAlerts = useCallback(() => {
    dispatch(getAlerts({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  useEffect(() => {
    handleGetAlerts();

    const interval = setInterval(() => {
      dispatch(checkAlertsToRefresh({
        ...searchParams,
        take: ITEMS_PER_PAGE,
      }));
    }, ALERTS_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [searchParams, handleGetAlerts]);

  return (
    <>
      <ModuleWrapper
        commandBar={<AlertsCommandBar />}
        filters={(
          <AlertsFilters
            total={total}
            isExporting={isExporting}
            isExportDisabled={isLoading}
            initialValues={searchParams}
            onFiltersSubmit={handleFiltersSubmit}
            onExport={handleExport}
          />
        )}
        table={(
          <AlertsTable
            total={total}
            offset={offset}
            ids={ids}
            isLoading={isLoading}
            entities={entities}
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
      <AlertsDismissDialog />
    </>
  );
};

export default Alerts;
