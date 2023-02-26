import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter, ITEMS_PER_PAGE, usePagination, useExport, useFilter, useSearchParams,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../../../components/ModuleWrapper/ModuleWrapper';
import { activityReportReducerSelector } from '../state/selectors';
import { clearActivityReport, exportActivityReport, getActivityReport } from '../state/actions';
import { initialActivityFilters } from '../constants';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { ActivityReportTable } from './ActivityReportTable/ActivityReportTable';
import { preprocessReportFiltersPanelValues } from '../../../helpers';
import { ActivityReportFilters } from './ActivityReportFilters/ActivityReportFilters';

export const Activity = () => {
  const dispatch = useDispatch();
  const { forcePage, handlePageChange, offset } = usePagination();
  const searchParams = useSearchParams();
  const {
    isLoading, total, isExporting, data,
  } = useSelector(activityReportReducerSelector);
  const { handleExport } = useExport(total, exportActivityReport);
  const { handleFiltersSubmit } = useFilter<IGetProcessedReportRequestFiltersParams>();

  const handleFiltersFormSubmit = useCallback((dataForm) => {
    const preprocessedData = preprocessReportFiltersPanelValues({
      ...initialActivityFilters,
      ...dataForm,
    });

    handleFiltersSubmit(preprocessedData);
  }, [handleFiltersSubmit]);

  const handleGetActivityReport = useCallback(() => {
    dispatch(getActivityReport({
      ...initialActivityFilters,
      ...searchParams,
    }));
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(searchParams).length) {
      handleGetActivityReport();
    }

    return () => {
      dispatch(clearActivityReport());
    };
  }, [searchParams, handleGetActivityReport]);

  return (
    <ModuleWrapper
      commandBar={null}
      filters={(
        <ActivityReportFilters
          total={total}
          isExporting={isExporting}
          isExportDisabled={isLoading}
          isAutoSubmitOnReset={false}
          initialValues={searchParams}
          onFiltersSubmit={handleFiltersFormSubmit}
          onExport={handleExport}
        />
      )}
      table={(
        <ActivityReportTable
          total={total}
          offset={offset}
          data={data}
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
