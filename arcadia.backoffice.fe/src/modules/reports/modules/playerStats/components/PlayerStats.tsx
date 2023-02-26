import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter, ITEMS_PER_PAGE, usePagination, useExport, useFilter, useSearchParams,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../../../components/ModuleWrapper/ModuleWrapper';
import { playerStatsReportReducerSelector } from '../state/selectors';
import { clearPlayerStatsReport, exportPlayerStatsReport, getPlayerStatsReport } from '../state/actions';
import { initialPlayerStatsFilters } from '../constants';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { PlayerStatsReportTable } from './PlayerStatsReportTable/PlayerStatsReportTable';
import { preprocessReportFiltersPanelValues } from '../../../helpers';
import { PlayerStatsReportFilters } from './PlayerStatsReportFilters/PlayerStatsReportFilters';

export const PlayerStats = () => {
  const dispatch = useDispatch();
  const { forcePage, handlePageChange, offset } = usePagination();
  const searchParams = useSearchParams();
  const {
    isLoading, total, isExporting, data,
  } = useSelector(playerStatsReportReducerSelector);
  const { handleExport } = useExport(total, exportPlayerStatsReport);
  const { handleFiltersSubmit } = useFilter<IGetProcessedReportRequestFiltersParams>();

  const handleFiltersFormSubmit = useCallback((dataForm) => {
    const preprocessedData = preprocessReportFiltersPanelValues({
      ...initialPlayerStatsFilters,
      ...dataForm,
    });

    handleFiltersSubmit(preprocessedData);
  }, [handleFiltersSubmit]);

  const handleGetPlayerStatsReport = useCallback(() => {
    dispatch(getPlayerStatsReport({
      ...initialPlayerStatsFilters,
      ...searchParams,
    }));
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.startDate && searchParams.endDate && searchParams.groupBy) {
      handleGetPlayerStatsReport();
    }

    return () => {
      dispatch(clearPlayerStatsReport());
    };
  }, [searchParams, handleGetPlayerStatsReport]);

  return (
    <ModuleWrapper
      commandBar={null}
      filters={(
        <PlayerStatsReportFilters
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
        <PlayerStatsReportTable
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
