import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, ExportButton, ITEMS_PER_PAGE, TableFooter, useTableSorting,
} from 'arcadia-common-fe';
import { administrationDialogUserActionsSelector } from '../../state/selectors';
import { exportAdministrationUserActions, getUserActions, setAdministrationDialogUserActions } from '../../state/actions';
import { AdministrationTableUserActions } from './AdministrationTableUserActions/AdministrationTableUserActions';
import { IFilterParamsUserActions } from '../../types';
import './AdministrationDialogUserActions.scss';

interface IAdministrationDialogUserActionsProps {
}

export const AdministrationDialogUserActions: React.FC<IAdministrationDialogUserActionsProps> = () => {
  const dispatch = useDispatch();
  const {
    id, isOpen, total, actions, isLoading, isExporting, filterParams,
  } = useSelector(administrationDialogUserActionsSelector);

  const handleClose = useCallback(() => {
    dispatch(setAdministrationDialogUserActions());
  }, []);

  const handleGetUserActions = useCallback((searchValues: IFilterParamsUserActions) => {
    dispatch(getUserActions({
      id,
      filterParams: searchValues,
    }));
  }, [id]);

  const handleExport = useCallback(() => {
    dispatch(exportAdministrationUserActions({
      id,
      filterParams,
    }));
  }, [id, filterParams]);

  const handlePageChange = useCallback(({ selected }) => {
    const newFilterParams = {
      ...filterParams,
      offset: selected * ITEMS_PER_PAGE,
    };

    dispatch(getUserActions({ id, filterParams: newFilterParams }));
  }, [id, filterParams]);

  const forcePage = useMemo(() => (
    Number(filterParams.offset) / ITEMS_PER_PAGE || 0
  ), [filterParams]);

  const { onSort } = useTableSorting(filterParams, handleGetUserActions);

  useEffect(() => {
    handleGetUserActions(filterParams);
  }, [handleGetUserActions]);

  return (
    <Dialog
      className="administration-user-actions"
      isOpen={isOpen}
      title="User Actions"
      onClose={handleClose}
    >
      <div className="administration-user-actions__export">
        <ExportButton
          disabled={total <= 0}
          isLoading={isExporting}
          onClick={handleExport}
        />
      </div>
      <AdministrationTableUserActions
        actions={actions}
        isLoading={isLoading}
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
