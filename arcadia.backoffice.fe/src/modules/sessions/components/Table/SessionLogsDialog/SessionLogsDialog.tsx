import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, IDialogProps, ITEMS_PER_PAGE, TableFooter, useTableSorting,
} from 'arcadia-common-fe';
import { SessionLogsTable } from './SessionLogsTable/SessionLogsTable';
import { sessionDialogLogsSelector } from '../../../selectors';
import { setSessionLogsDialog, getLogs, exportSessionLogs } from '../../../actions';
import { SessionLogsFilters } from './SessionLogsFilters/SessionLogsFilters';
import { IGetLogsRequestFiltersParams } from '../../../types';
import './SessionLogsDialog.scss';

export interface ISessionLogsDialogProps extends Partial<IDialogProps> {
}

export const SessionLogsDialog: React.FC<ISessionLogsDialogProps> = (props) => {
  const {
    session, isOpen, isLoading, isExporting, filterParams, logs, total,
  } = useSelector(sessionDialogLogsSelector);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(setSessionLogsDialog());
  }, []);

  const handleGetSessionLogs = useCallback((searchValues: IGetLogsRequestFiltersParams) => {
    if (session?.id) {
      dispatch(getLogs({ session, filterParams: searchValues }));
    }
  }, [session]);

  const forcePage = useMemo(() => (filterParams?.offset ? (Number(filterParams.offset) / ITEMS_PER_PAGE) : 0), [filterParams]);

  const { onSort } = useTableSorting(filterParams, handleGetSessionLogs);

  const handlePageChange = useCallback(({ selected }) => {
    if (Number.isNaN(selected)) {
      return;
    }

    const newSearchParams = {
      ...filterParams,
      offset: selected * ITEMS_PER_PAGE,
    };

    handleGetSessionLogs(newSearchParams);
  }, [handleGetSessionLogs, filterParams]);

  const handleExport = useCallback(() => {
    if (session?.id) {
      dispatch(exportSessionLogs({
        session,
        filterParams: { ...filterParams, take: total },
      }));
    }
  }, [session, filterParams, total]);

  const handleReset = useCallback(() => {
    handleGetSessionLogs({});
  }, [handleGetSessionLogs]);

  const handleFiltersSubmit = useCallback((data) => {
    handleGetSessionLogs({ ...data, offset: 0 });
  }, [handleGetSessionLogs]);

  useEffect(() => {
    if (isOpen) {
      handleGetSessionLogs(filterParams);
    }
  }, [isOpen, handleGetSessionLogs, filterParams]);

  return (
    <Dialog
      {...props}
      className="session-logs-dialog"
      title="Logs"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <SessionLogsFilters
        initialValues={filterParams}
        total={total}
        isExporting={isExporting}
        onFiltersSubmit={handleFiltersSubmit}
        onExport={handleExport}
        onReset={handleReset}
      />
      <SessionLogsTable
        isLoading={isLoading}
        logs={logs}
        total={total}
        sortData={filterParams}
        onSort={onSort}
      />
      <TableFooter
        total={total}
        itemsPerPage={ITEMS_PER_PAGE}
        paginationProps={{
          forcePage,
          onPageChange: handlePageChange,
        }}
      />
    </Dialog>
  );
};
