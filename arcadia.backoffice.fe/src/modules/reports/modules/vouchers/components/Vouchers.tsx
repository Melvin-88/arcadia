import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter, ITEMS_PER_PAGE, usePagination, useExport, useFilter, useSearchParams,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../../../components/ModuleWrapper/ModuleWrapper';
import { vouchersReportReducerSelector } from '../state/selectors';
import { clearVouchersReport, exportVouchersReport, getVouchersReport } from '../state/actions';
import { initialVouchersFilters } from '../constants';
import { IGetProcessedReportRequestFiltersParams, IReportsFiltersPanelValues } from '../../../types';
import { VouchersReportTable } from './VouchersReportTable/VouchersReportTable';
import { preprocessReportFiltersPanelValues } from '../../../helpers';
import { VouchersReportFilters } from './VouchersReportFilters/VouchersReportFilters';

export const Vouchers = () => {
  const dispatch = useDispatch();
  const { forcePage, handlePageChange, offset } = usePagination();
  const searchParams = useSearchParams();
  const {
    isLoading, total, isExporting, data,
  } = useSelector(vouchersReportReducerSelector);

  const { handleExport } = useExport(total, exportVouchersReport);
  const { handleFiltersSubmit } = useFilter<IGetProcessedReportRequestFiltersParams>();

  const handleFiltersFormSubmit = useCallback((dataForm) => {
    const newDataForm = { ...dataForm };

    if (newDataForm.cid) {
      newDataForm.cid = newDataForm.cid.toString().split(',');
    }

    const preprocessedData: IReportsFiltersPanelValues = preprocessReportFiltersPanelValues({
      ...initialVouchersFilters,
      ...newDataForm,
    });

    handleFiltersSubmit(preprocessedData);
  }, [handleFiltersSubmit]);

  const handleGetVouchersReport = useCallback(() => {
    dispatch(getVouchersReport({
      ...initialVouchersFilters,
      ...searchParams,
    }));
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(searchParams).length) {
      handleGetVouchersReport();
    }

    return () => {
      dispatch(clearVouchersReport());
    };
  }, [searchParams, handleGetVouchersReport]);

  return (
    <ModuleWrapper
      commandBar={null}
      filters={(
        <VouchersReportFilters
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
        <VouchersReportTable
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
