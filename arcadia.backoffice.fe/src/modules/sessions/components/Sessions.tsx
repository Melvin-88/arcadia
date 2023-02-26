import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter,
  ITEMS_PER_PAGE,
  TimeSpanFormat,
  convertTimeToSeconds,
  useSearchParams,
  useFilter,
  useExport,
  usePagination,
  secondsToMinutes,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../components/ModuleWrapper/ModuleWrapper';
import { SessionsFilters } from './SessionsFilters/SessionsFilters';
import { SessionsTable } from './Table/Table';
import { exportSessions, getSessions } from '../actions';
import { sessionsReducerSelector } from '../selectors';
import { IGetSessionsRequestFiltersParams } from '../types';
import { SESSIONS_UPDATE_INTERVAL } from '../../../constants';

const Sessions = () => {
  const dispatch = useDispatch();
  const {
    isLoading, isExporting, total, sessions,
  } = useSelector(sessionsReducerSelector);
  const searchParams = useSearchParams();

  const { handleFiltersSubmit } = useFilter<IGetSessionsRequestFiltersParams>();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleExport } = useExport(total, exportSessions);

  const handleGetSessions = useCallback(() => {
    dispatch(getSessions({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  useEffect(() => {
    handleGetSessions();

    const interval = setInterval(() => {
      handleGetSessions();
    }, SESSIONS_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetSessions]);

  const filtersInitialValues = useMemo(() => {
    const newInitialValues = { ...searchParams };

    if (searchParams.durationFrom) {
      newInitialValues.durationFrom = secondsToMinutes(Number(searchParams.durationFrom)).toString();
    }
    if (searchParams.durationTo) {
      newInitialValues.durationTo = secondsToMinutes(Number(searchParams.durationTo)).toString();
    }

    return newInitialValues;
  }, [searchParams]);

  const handleFiltersFormSubmit = useCallback((data) => {
    const newFiltersOptions = { ...data };

    if (data.durationFrom) {
      newFiltersOptions.durationFrom = convertTimeToSeconds(data.durationFrom, TimeSpanFormat.mm);
    }
    if (data.durationTo) {
      newFiltersOptions.durationTo = convertTimeToSeconds(data.durationTo, TimeSpanFormat.mm);
    }

    handleFiltersSubmit(newFiltersOptions);
  }, []);

  return (
    <ModuleWrapper
      filters={(
        <SessionsFilters
          total={total}
          isExporting={isExporting}
          isExportDisabled={isLoading}
          initialValues={filtersInitialValues}
          onFiltersSubmit={handleFiltersFormSubmit}
          onExport={handleExport}
        />
      )}
      table={(
        <SessionsTable
          total={total}
          offset={offset}
          sessions={sessions}
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

export default Sessions;
