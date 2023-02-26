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
import { PlayersTable } from './Table/PlayersTable';
import { playersReducerSelector } from '../state/selectors';
import { exportPlayers, getPlayers } from '../state/actions';
import { PlayersFilters } from './PlayersFilters/PlayersFilters';
import { IGetPlayersRequestFilterParams } from '../types';

const Players = () => {
  const dispatch = useDispatch();
  const {
    isLoading, isExporting, total, players,
  } = useSelector(playersReducerSelector);
  const searchParams = useSearchParams();

  const { handleFiltersSubmit } = useFilter<IGetPlayersRequestFilterParams>();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleExport } = useExport(total, exportPlayers);

  useEffect(() => {
    dispatch(getPlayers({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  return (
    <ModuleWrapper
      filters={(
        <PlayersFilters
          total={total}
          isExporting={isExporting}
          isExportDisabled={isLoading}
          initialValues={searchParams}
          onFiltersSubmit={handleFiltersSubmit}
          onExport={handleExport}
        />
      )}
      table={(
        <PlayersTable
          total={total}
          offset={offset}
          players={players}
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
  );
};

export default Players;
