import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter,
  ITEMS_PER_PAGE,
  useSearchParams,
  useFilter,
  useExport,
  usePagination,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../components/ModuleWrapper/ModuleWrapper';
import { operatorsReducerSelector } from '../state/selectors';
import { OperatorsTable } from './Table/OperatorsTable';
import { exportOperators, getOperators } from '../state/actions';
import { IGetOperatorsRequestFilterParams } from '../types';
import { OperatorsDialogForm } from './OperatorsDialogForm/OperatorsDialogForm';
import { OperatorsCommandBar } from './OperatorsCommandBar/OperatorsCommandBar';
import { OperatorsFilters } from './OperatorsFilters/OperatorsFilters';

const Operators = () => {
  const dispatch = useDispatch();
  const {
    isLoading, isExporting, total, operators,
  } = useSelector(operatorsReducerSelector);
  const searchParams = useSearchParams();

  const { handleFiltersSubmit } = useFilter<IGetOperatorsRequestFilterParams>();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleExport } = useExport(total, exportOperators);

  useEffect(() => {
    dispatch(getOperators({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  return (
    <>
      <ModuleWrapper
        commandBar={<OperatorsCommandBar />}
        filters={(
          <OperatorsFilters
            total={total}
            isExporting={isExporting}
            isExportDisabled={isLoading}
            initialValues={searchParams}
            onFiltersSubmit={handleFiltersSubmit}
            onExport={handleExport}
          />
        )}
        table={(
          <OperatorsTable
            total={total}
            offset={offset}
            operators={operators}
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
      <OperatorsDialogForm />
    </>
  );
};

export default Operators;
