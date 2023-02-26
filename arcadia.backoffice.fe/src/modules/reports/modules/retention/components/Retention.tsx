import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter, ITEMS_PER_PAGE, usePagination, useExport, useFilter, useSearchParams,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../../../components/ModuleWrapper/ModuleWrapper';
import { retentionReportReducerSelector } from '../state/selectors';
import { clearRetentionReport, exportRetentionReport, getRetentionReport } from '../state/actions';
import { initialRetentionFilters } from '../constants';
import { IReportsFiltersPanelValues, IGetProcessedReportRequestFiltersParams } from '../../../types';
import { RetentionReportTable } from './RetentionReportTable/RetentionReportTable';
import { preprocessReportFiltersPanelValues } from '../../../helpers';
import { RetentionReportFilters } from './RetentionReportFilters/RetentionReportFilters';

export const Retention = () => {
  const dispatch = useDispatch();
  const { forcePage, handlePageChange, offset } = usePagination();
  const searchParams = useSearchParams();
  const {
    isLoading, total, isExporting, data,
  } = useSelector(retentionReportReducerSelector);
  const { handleExport } = useExport(total, exportRetentionReport);
  const { handleFiltersSubmit } = useFilter<IGetProcessedReportRequestFiltersParams>();

  const handleFiltersFormSubmit = useCallback((dataForm: IReportsFiltersPanelValues) => {
    const preprocessedData = preprocessReportFiltersPanelValues({
      ...initialRetentionFilters,
      ...dataForm,
    });

    handleFiltersSubmit(preprocessedData);
  }, [handleFiltersSubmit]);

  const handleGetRetentionReport = useCallback(() => {
    dispatch(getRetentionReport({
      ...initialRetentionFilters,
      ...searchParams,
    }));
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(searchParams).length) {
      handleGetRetentionReport();
    }

    return () => {
      dispatch(clearRetentionReport());
    };
  }, [searchParams, handleGetRetentionReport]);

  return (
    <ModuleWrapper
      commandBar={null}
      filters={(
        <RetentionReportFilters
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
        <RetentionReportTable
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
