import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, IDialogProps, ITEMS_PER_PAGE, TableFooter, useTableSorting,
} from 'arcadia-common-fe';
import { processedReportsSelector } from '../state/selectors';
import { getProcessedReports, setProcessedReportsDialog } from '../state/actions';
import { IProcessedReportsRequestFiltersParams } from '../types';
import { ProcessedReportsDialogTable } from './ProcessedReportsDialogTable/ProcessedReportsDialogTable';
import './ProcessedReportsDialog.scss';

export interface IProcessedReportsDialogProps extends Partial<IDialogProps> {
  reportType: string
}

export const ProcessedReportsDialog: React.FC<IProcessedReportsDialogProps> = ({ reportType, ...restProps }) => {
  const dispatch = useDispatch();
  const {
    isOpen,
    filterParams,
    isLoading,
    data,
    total,
  } = useSelector(processedReportsSelector);

  const handleGetReportsProcessed = useCallback((searchValues: IProcessedReportsRequestFiltersParams) => {
    dispatch(getProcessedReports({
      reportType,
      filterParams: searchValues,
    }));
  }, [reportType]);

  const forcePage = useMemo(() => (filterParams?.offset ? (Number(filterParams.offset) / ITEMS_PER_PAGE) : 0), [filterParams]);

  const { onSort } = useTableSorting(filterParams, handleGetReportsProcessed);

  const handlePageChange = useCallback(({ selected }) => {
    if (Number.isNaN(selected)) {
      return;
    }

    const newSearchParams = {
      ...filterParams,
      offset: selected * ITEMS_PER_PAGE,
    };

    handleGetReportsProcessed(newSearchParams);
  }, [handleGetReportsProcessed, filterParams]);

  const handleClose = useCallback(() => {
    dispatch(setProcessedReportsDialog());
  }, []);

  useEffect(() => {
    if (isOpen) {
      handleGetReportsProcessed(filterParams);
    }
  }, [isOpen, handleGetReportsProcessed, filterParams]);

  return (
    <Dialog
      className="dialog-processed-reports"
      title="Processed Reports"
      isOpen={isOpen}
      onClose={handleClose}
      {...restProps}
    >
      <ProcessedReportsDialogTable
        isLoading={isLoading}
        total={total}
        data={data}
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
