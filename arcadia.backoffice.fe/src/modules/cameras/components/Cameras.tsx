import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableFooter,
  ITEMS_PER_PAGE,
  useSearchParams,
  useFilter,
  usePagination,
  useHistoryPush,
} from 'arcadia-common-fe';
import { ModuleWrapper } from '../../../components/ModuleWrapper/ModuleWrapper';
import { CamerasTable } from './Table/CamerasTable';
import { camerasReducerSelector } from '../state/selectors';
import { clearCameras, exportCameras, getCameras } from '../state/actions';
import { CamerasFilters } from './CamerasFilters/CamerasFilters';
import { IGetCamerasRequestFiltersParams } from '../types';
import { CamerasCommandBar } from './CamerasCommandBar/CamerasCommandBar';
import { CamerasDialogForm } from './CamerasDialogForm/CamerasDialogForm';
import { WatchCamerasDialog } from './WatchCamerasDialog/WatchCamerasDialog';

const Cameras = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const {
    isLoading, isExporting, total, cameras,
  } = useSelector(camerasReducerSelector);
  const { handleFiltersSubmit } = useFilter<IGetCamerasRequestFiltersParams>();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleHistoryPush } = useHistoryPush();

  const handleExport = useCallback(() => {
    if (searchParams.site) {
      dispatch(exportCameras({
        ...searchParams,
        offset: 0,
        take: total,
      }));
    }
  }, [searchParams]);

  const handleReset = useCallback(() => {
    if (searchParams.site) {
      handleHistoryPush({
        site: String(searchParams.site),
        take: ITEMS_PER_PAGE,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.site) {
      dispatch(getCameras({
        ...searchParams,
        take: ITEMS_PER_PAGE,
      }));
    }

    return () => {
      dispatch(clearCameras());
    };
  }, [searchParams]);

  return (
    <>
      <ModuleWrapper
        commandBar={<CamerasCommandBar />}
        filters={searchParams.site && (
          <CamerasFilters
            total={total}
            isExporting={isExporting}
            isExportDisabled={isLoading}
            initialValues={searchParams}
            onFiltersSubmit={handleFiltersSubmit}
            onExport={handleExport}
            onReset={handleReset}
          />
        )}
        table={searchParams.site && (
          <CamerasTable
            total={total}
            cameras={cameras}
            site={String(searchParams.site)}
            offset={offset}
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
      <CamerasDialogForm site={searchParams.site ? String(searchParams.site) : null} />
      <WatchCamerasDialog />
    </>
  );
};

export default Cameras;
