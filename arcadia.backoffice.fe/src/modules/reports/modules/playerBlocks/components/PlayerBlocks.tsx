import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter, ITEMS_PER_PAGE, usePagination, useExport, useFilter, useSearchParams,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../../../components/ModuleWrapper/ModuleWrapper';
import { playerBlocksReportReducerSelector } from '../state/selectors';
import { clearPlayerBlocksReport, exportPlayerBlocksReport, getPlayerBlocksReport } from '../state/actions';
import { initialPlayerBlocksFilters } from '../constants';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { PlayerBlocksReportTable } from './PlayerBlocksReportTable/PlayerBlocksReportTable';
import { preprocessReportFiltersPanelValues } from '../../../helpers';
import { PlayerBlocksReportFilters } from './PlayerBlocksReportFilters/PlayerBlocksReportFilters';

export const PlayerBlocks = () => {
  const dispatch = useDispatch();
  const { forcePage, handlePageChange, offset } = usePagination();
  const searchParams = useSearchParams();
  const {
    isLoading, total, isExporting, data,
  } = useSelector(playerBlocksReportReducerSelector);
  const { handleExport } = useExport(total, exportPlayerBlocksReport);
  const { handleFiltersSubmit } = useFilter<IGetProcessedReportRequestFiltersParams>();

  const handleFiltersFormSubmit = useCallback((dataForm) => {
    const preprocessedData = preprocessReportFiltersPanelValues({
      ...initialPlayerBlocksFilters,
      ...dataForm,
    });

    handleFiltersSubmit(preprocessedData);
  }, [handleFiltersSubmit]);

  const handleGetPlayerBlocksReport = useCallback(() => {
    dispatch(getPlayerBlocksReport({
      ...initialPlayerBlocksFilters,
      ...searchParams,
    }));
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(searchParams).length) {
      handleGetPlayerBlocksReport();
    }

    return () => {
      dispatch(clearPlayerBlocksReport());
    };
  }, [searchParams, handleGetPlayerBlocksReport]);

  return (
    <ModuleWrapper
      commandBar={null}
      filters={(
        <PlayerBlocksReportFilters
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
        <PlayerBlocksReportTable
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
