import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter, ITEMS_PER_PAGE, usePagination, useExport, useFilter, useSearchParams,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../../../components/ModuleWrapper/ModuleWrapper';
import { machineStatusReportReducerSelector } from '../state/selectors';
import { clearMachineStatusReport, exportMachineStatusReport, getMachineStatusReport } from '../state/actions';
import { initialMachineStatusFilters } from '../constants';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { MachineStatusReportTable } from './MachineStatusReportTable/MachineStatusReportTable';
import { preprocessReportFiltersPanelValues } from '../../../helpers';
import { initialDisputesFilters } from '../../disputes/constants';
import { MachineStatusReportFilters } from './MachineStatusReportFilters/MachineStatusReportFilters';

export const MachineStatus = () => {
  const dispatch = useDispatch();
  const { forcePage, handlePageChange, offset } = usePagination();
  const searchParams = useSearchParams();
  const {
    isLoading, total, isExporting, data,
  } = useSelector(machineStatusReportReducerSelector);
  const { handleExport } = useExport(total, exportMachineStatusReport);
  const { handleFiltersSubmit } = useFilter<IGetProcessedReportRequestFiltersParams>();

  const handleFiltersFormSubmit = useCallback((dataForm) => {
    const preprocessedData = preprocessReportFiltersPanelValues({
      ...initialDisputesFilters,
      ...dataForm,
    });

    handleFiltersSubmit(preprocessedData);
  }, [handleFiltersSubmit]);

  const handleGetMachineStatusReport = useCallback(() => {
    dispatch(getMachineStatusReport({
      ...initialMachineStatusFilters,
      ...searchParams,
    }));
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(searchParams).length) {
      handleGetMachineStatusReport();
    }

    return () => {
      dispatch(clearMachineStatusReport());
    };
  }, [searchParams, handleGetMachineStatusReport]);

  return (
    <ModuleWrapper
      commandBar={null}
      filters={(
        <MachineStatusReportFilters
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
        <MachineStatusReportTable
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
