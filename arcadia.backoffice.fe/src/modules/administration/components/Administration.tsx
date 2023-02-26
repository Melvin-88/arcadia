import React, { useCallback, useEffect } from 'react';
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
import { administrationReducerSelector } from '../state/selectors';
import { exportAdministration, getAdministration } from '../state/actions';
import { AdministrationTable } from './AdministrationTable/AdministrationTable';
import { AdministrationFilters } from './AdministrationFilters/AdministrationFilters';
import { AdministrationCommandBar } from './AdministrationCommandBar/AdministrationCommandBar';
import { AdministrationDialogRegisterChips } from './AdministrationDialogRegisterChips/AdministrationDialogRegisterChips';
import { IGetAdministrationRequestFiltersParams } from '../types';
import { AdministrationDialogForm } from './AdministrationDialogForm/AdministrationDialogForm';
import { AdministrationDialogDisqualifyChips } from './AdministrationDialogDisqualifyChips/AdministrationDialogDisqualifyChips';
import { AdministrationDialogUserActions } from './AdministrationDialogUserActions/AdministrationDialogUserActions';

const Administration = () => {
  const dispatch = useDispatch();
  const {
    isLoading, isExporting, total, users,
  } = useSelector(administrationReducerSelector);
  const searchParams = useSearchParams();

  const { handleFiltersSubmit } = useFilter<IGetAdministrationRequestFiltersParams>();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleExport } = useExport(total, exportAdministration);

  useEffect(() => {
    dispatch(getAdministration({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  const handleFiltersFormSubmit = useCallback((data) => {
    handleFiltersSubmit(data);
  }, []);

  return (
    <>
      <ModuleWrapper
        commandBar={<AdministrationCommandBar />}
        filters={(
          <AdministrationFilters
            total={total}
            isExporting={isExporting}
            isExportDisabled={isLoading}
            initialValues={searchParams}
            onFiltersSubmit={handleFiltersFormSubmit}
            onExport={handleExport}
          />
        )}
        table={(
          <AdministrationTable
            total={total}
            offset={offset}
            users={users}
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
      <AdministrationDialogRegisterChips />
      <AdministrationDialogDisqualifyChips />
      <AdministrationDialogForm />
      <AdministrationDialogUserActions />
    </>
  );
};

export default Administration;
