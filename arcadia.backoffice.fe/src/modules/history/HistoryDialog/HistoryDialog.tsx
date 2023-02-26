import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, IDialogProps, TableFooter, ITEMS_PER_PAGE, useTableSorting,
} from 'arcadia-common-fe';
import { HistoryTable } from './HistoryTable/HistoryTable';
import { historySelector } from '../state/selectors';
import { resetHistory, exportHistory, getHistoryData } from '../state/actions';
import { HistoryFilters } from './HistoryFilters/HistoryFilters';
import { IGetHistoryRequestFiltersParams } from '../types';
import './HistoryDialog.scss';

export interface IHistoryDialogProps extends Partial<IDialogProps> {
}

export const HistoryDialog: React.FC<IHistoryDialogProps> = (props) => {
  const [formInitialValues, setFormInitialValues] = useState({});
  const dispatch = useDispatch();
  const {
    isOpen, history, total, isLoading, id, filterParams, historyType,
  } = useSelector(historySelector);

  const handleGetHistory = useCallback((searchValues: IGetHistoryRequestFiltersParams) => {
    if (historyType) {
      dispatch(getHistoryData({
        id,
        historyType,
        filterParams: searchValues,
      }));
    }
  }, [historyType, id]);

  const forcePage = useMemo(() => (filterParams?.offset ? (Number(filterParams.offset) / ITEMS_PER_PAGE) : 0), [filterParams]);

  const { onSort } = useTableSorting(filterParams, handleGetHistory);

  const handlePageChange = useCallback(({ selected }) => {
    if (Number.isNaN(selected)) {
      return;
    }

    const newSearchParams = {
      ...filterParams,
      offset: selected * ITEMS_PER_PAGE,
    };

    handleGetHistory(newSearchParams);
  }, [handleGetHistory, filterParams]);

  const handleClose = useCallback(() => {
    dispatch(resetHistory());
  }, []);

  const handleReset = useCallback(() => {
    handleGetHistory({});
    setFormInitialValues({});
  }, [setFormInitialValues, handleGetHistory]);

  const handleExport = useCallback(() => {
    if (historyType) {
      dispatch(exportHistory({
        id,
        historyType,
        filterParams,
      }));
    }
  }, [id, historyType, filterParams]);

  const handleFiltersSubmit = useCallback((data) => {
    handleGetHistory(data);
    setFormInitialValues(data);
  }, [handleGetHistory, setFormInitialValues]);

  return (
    <Dialog
      {...props}
      className="history-dialog"
      title="History"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <HistoryFilters
        total={total}
        initialValues={formInitialValues}
        onExport={handleExport}
        onReset={handleReset}
        onFiltersSubmit={handleFiltersSubmit}
      />
      <HistoryTable
        isLoading={isLoading}
        history={history}
        total={total}
        offset={Number(filterParams.offset) || 0}
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
