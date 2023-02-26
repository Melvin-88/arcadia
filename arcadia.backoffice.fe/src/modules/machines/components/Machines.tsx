import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter,
  ITEMS_PER_PAGE,
  TimeSpanFormat,
  convertTimeToSeconds,
  useSearchParams,
  useFilter,
  useExport,
  usePagination,
  secondsToMinutes,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../components/ModuleWrapper/ModuleWrapper';
import { MachinesTable } from './MachinesTable/MachinesTable';
import { exportMachines, getMachines } from '../state/actions';
import { machinesReducerSelector } from '../state/selectors';
import { MachinesFilters } from './MachinesFilters/MachinesFilters';
import { IGetMachinesRequestFiltersParams } from '../types';
import { MachinesCommandBar } from './MachinesCommandBar/MachinesCommandBar';
import { MachinesDialogForm } from './MachinesDialogForm/MachinesDialogForm';
import { MACHINES_UPDATE_INTERVAL } from '../../../constants';

const Machines = () => {
  const dispatch = useDispatch();
  const {
    isLoading, isExporting, total, machines,
  } = useSelector(machinesReducerSelector);
  const searchParams = useSearchParams();

  const { handleFiltersSubmit } = useFilter<IGetMachinesRequestFiltersParams>();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleExport } = useExport(total, exportMachines);

  const handleGetMachines = useCallback(() => {
    dispatch(getMachines({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  useEffect(() => {
    handleGetMachines();

    const interval = setInterval(() => {
      handleGetMachines();
    }, MACHINES_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetMachines]);

  const filtersInitialValues = useMemo(() => {
    const newInitialValues = { ...searchParams };

    if (searchParams.uptimeFrom) {
      newInitialValues.uptimeFrom = secondsToMinutes(Number(searchParams.uptimeFrom)).toString();
    }

    if (searchParams.uptimeTo) {
      newInitialValues.uptimeTo = secondsToMinutes(Number(searchParams.uptimeTo)).toString();
    }

    return newInitialValues;
  }, [searchParams]);

  const handleFiltersFormSubmit = useCallback((data) => {
    const newFiltersOptions = { ...data };

    if (data.uptimeFrom) {
      newFiltersOptions.uptimeFrom = convertTimeToSeconds(data.uptimeFrom, TimeSpanFormat.mm);
    }

    if (data.uptimeTo) {
      newFiltersOptions.uptimeTo = convertTimeToSeconds(data.uptimeTo, TimeSpanFormat.mm);
    }

    handleFiltersSubmit(newFiltersOptions);
  }, []);

  return (
    <>
      <ModuleWrapper
        commandBar={<MachinesCommandBar />}
        filters={(
          <MachinesFilters
            total={total}
            isExporting={isExporting}
            isExportDisabled={isLoading}
            initialValues={filtersInitialValues}
            onFiltersSubmit={handleFiltersFormSubmit}
            onExport={handleExport}
          />
        )}
        table={(
          <MachinesTable
            offset={offset}
            total={total}
            machines={machines}
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
      <MachinesDialogForm />
    </>
  );
};

export default Machines;
