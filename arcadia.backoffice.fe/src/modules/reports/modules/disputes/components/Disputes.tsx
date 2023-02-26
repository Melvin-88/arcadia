import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter, ITEMS_PER_PAGE, usePagination, useExport, useFilter, useSearchParams,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../../../components/ModuleWrapper/ModuleWrapper';
import { disputesReportReducerSelector } from '../state/selectors';
import { clearDisputesReport, exportDisputesReport, getDisputesReport } from '../state/actions';
import { initialDisputesFilters } from '../constants';
import { IGetProcessedReportRequestFiltersParams, IReportsFiltersPanelValues } from '../../../types';
import { DisputesReportTable } from './DisputesReportTable/DisputesReportTable';
import { preprocessReportFiltersPanelValues } from '../../../helpers';
import { DisputesReportFilters } from './DisputesReportFilters/DisputesReportFilters';

export const Disputes = () => {
  const dispatch = useDispatch();
  const { forcePage, handlePageChange, offset } = usePagination();
  const searchParams = useSearchParams();
  const {
    isLoading, total, isExporting, data,
  } = useSelector(disputesReportReducerSelector);
  const { handleExport } = useExport(total, exportDisputesReport);
  const { handleFiltersSubmit } = useFilter<IGetProcessedReportRequestFiltersParams>();

  const handleFiltersFormSubmit = useCallback((dataForm: IReportsFiltersPanelValues) => {
    const preprocessedData = preprocessReportFiltersPanelValues({
      ...initialDisputesFilters,
      ...dataForm,
    });

    handleFiltersSubmit(preprocessedData);
  }, [handleFiltersSubmit]);

  const handleGetDisputesReport = useCallback(() => {
    dispatch(getDisputesReport({
      ...initialDisputesFilters,
      ...searchParams,
    }));
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.startDate && searchParams.endDate && searchParams.groupBy) {
      handleGetDisputesReport();
    }

    return () => {
      dispatch(clearDisputesReport());
    };
  }, [searchParams, handleGetDisputesReport]);

  return (
    <ModuleWrapper
      commandBar={null}
      filters={(
        <DisputesReportFilters
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
        <DisputesReportTable
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
