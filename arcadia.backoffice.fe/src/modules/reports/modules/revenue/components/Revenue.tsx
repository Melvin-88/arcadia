import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter, ITEMS_PER_PAGE, usePagination, useExport, useFilter, useSearchParams,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../../../components/ModuleWrapper/ModuleWrapper';
import { revenueReportReducerSelector } from '../state/selectors';
import { clearRevenueReport, exportRevenueReport, getRevenueReport } from '../state/actions';
import { initialRevenueFilters } from '../constants';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { RevenueReportTable } from './RevenueReportTable/RevenueReportTable';
import { preprocessReportFiltersPanelValues } from '../../../helpers';
import { RevenueReportFilters } from './RevenueReportFilters/RevenueReportFilters';

export const Revenue = () => {
  const dispatch = useDispatch();
  const { forcePage, handlePageChange, offset } = usePagination();
  const searchParams = useSearchParams();
  const {
    isLoading, total, isExporting, data,
  } = useSelector(revenueReportReducerSelector);
  const { handleExport } = useExport(total, exportRevenueReport);
  const { handleFiltersSubmit } = useFilter<IGetProcessedReportRequestFiltersParams>();

  const handleFiltersFormSubmit = useCallback((dataForm) => {
    const preprocessedData = preprocessReportFiltersPanelValues({
      ...initialRevenueFilters,
      ...dataForm,
    });

    handleFiltersSubmit(preprocessedData);
  }, [handleFiltersSubmit]);

  const handleGetRevenueReport = useCallback(() => {
    dispatch(getRevenueReport({
      ...initialRevenueFilters,
      ...searchParams,
    }));
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(searchParams).length) {
      handleGetRevenueReport();
    }

    return () => {
      dispatch(clearRevenueReport());
    };
  }, [searchParams, handleGetRevenueReport]);

  return (
    <ModuleWrapper
      commandBar={null}
      filters={(
        <RevenueReportFilters
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
        <RevenueReportTable
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
