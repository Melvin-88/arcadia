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
import { DisputesTable } from './DisputesTable/DisputesTable';
import { exportDisputes, getDisputes } from '../state/actions';
import { disputesReducerSelector } from '../state/selectors';
import { DisputesFilters } from './DisputesFilters/DisputesFilters';
import { IGetDisputesRequestFiltersParams } from '../types';
import { DisputesCommandBar } from './DisputesCommandBar/DisputesCommandBar';
import { DisputesDialogForm } from './DisputesDialogForm/DisputesDialogForm';

const Disputes = () => {
  const dispatch = useDispatch();
  const {
    isLoading, isExporting, total, disputes,
  } = useSelector(disputesReducerSelector);
  const searchParams = useSearchParams();

  const { handleFiltersSubmit } = useFilter<IGetDisputesRequestFiltersParams>();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleExport } = useExport(total, exportDisputes);

  useEffect(() => {
    dispatch(getDisputes({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  return (
    <>
      <ModuleWrapper
        commandBar={<DisputesCommandBar />}
        filters={(
          <DisputesFilters
            total={total}
            isExporting={isExporting}
            isExportDisabled={isLoading}
            initialValues={searchParams}
            onFiltersSubmit={handleFiltersSubmit}
            onExport={handleExport}
          />
        )}
        table={(
          <DisputesTable
            total={total}
            offset={offset}
            disputes={disputes}
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
      <DisputesDialogForm />
    </>
  );
};

export default Disputes;
