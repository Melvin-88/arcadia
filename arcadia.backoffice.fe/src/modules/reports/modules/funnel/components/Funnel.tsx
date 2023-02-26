import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter, ITEMS_PER_PAGE, usePagination, useExport, useFilter, useSearchParams,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../../../components/ModuleWrapper/ModuleWrapper';
import { funnelReportReducerSelector } from '../state/selectors';
import { clearFunnelReport, exportFunnelReport, getFunnelReport } from '../state/actions';
import { initialFunnelFilters } from '../constants';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { FunnelReportTable } from './FunnelReportTable/FunnelReportTable';
import { preprocessReportFiltersPanelValues } from '../../../helpers';
import { FunnelReportFilters } from './FunnelReportFilters/FunnelReportFilters';

export const Funnel = () => {
  const dispatch = useDispatch();
  const { forcePage, handlePageChange, offset } = usePagination();
  const searchParams = useSearchParams();
  const {
    isLoading, total, isExporting, data,
  } = useSelector(funnelReportReducerSelector);
  const { handleExport } = useExport(total, exportFunnelReport);
  const { handleFiltersSubmit } = useFilter<IGetProcessedReportRequestFiltersParams>();

  const handleFiltersFormSubmit = useCallback((dataForm) => {
    const preprocessedData = preprocessReportFiltersPanelValues({
      ...initialFunnelFilters,
      ...dataForm,
    });

    handleFiltersSubmit(preprocessedData);
  }, [handleFiltersSubmit]);

  const handleGetFunnelReport = useCallback(() => {
    dispatch(getFunnelReport({
      ...initialFunnelFilters,
      ...searchParams,
    }));
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.startDate && searchParams.endDate && searchParams.groupBy) {
      handleGetFunnelReport();
    }

    return () => {
      dispatch(clearFunnelReport());
    };
  }, [searchParams, handleGetFunnelReport]);

  return (
    <ModuleWrapper
      commandBar={null}
      filters={(
        <FunnelReportFilters
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
        <FunnelReportTable
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
