import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter,
  ITEMS_PER_PAGE,
  useSearchParams,
  useFilter,
  useExport,
  usePagination,
  IGetVouchersRequestFiltersParams,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../components/ModuleWrapper/ModuleWrapper';
import { vouchersReducerSelector } from '../state/selectors';
import { exportVouchers, getVouchers } from '../state/actions';
import { VouchersTable } from './VouchersTable/VouchersTable';
import { VouchersFilters } from './VouchersFilters/VouchersFilters';
import { VouchersCommandBar } from './VouchersCommandBar/VouchersCommandBar';
import { VouchersRevokeDialog } from './VouchersRevokeDialog/VouchersRevokeDialog';

const Vouchers = () => {
  const dispatch = useDispatch();
  const {
    isLoading, total, ids, entities, isExporting,
  } = useSelector(vouchersReducerSelector);

  const searchParams = useSearchParams();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleFiltersSubmit } = useFilter<IGetVouchersRequestFiltersParams>();
  const { handleExport } = useExport(total, exportVouchers);

  useEffect(() => {
    dispatch(getVouchers({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  return (
    <>
      <ModuleWrapper
        commandBar={(
          <VouchersCommandBar />
        )}
        filters={(
          <VouchersFilters
            total={total}
            isExporting={isExporting}
            isExportDisabled={isLoading}
            initialValues={searchParams}
            onFiltersSubmit={handleFiltersSubmit}
            onExport={handleExport}
          />
        )}
        table={(
          <VouchersTable
            total={total}
            offset={offset}
            ids={ids}
            entities={entities}
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
      <VouchersRevokeDialog />
    </>
  );
};

export default Vouchers;
