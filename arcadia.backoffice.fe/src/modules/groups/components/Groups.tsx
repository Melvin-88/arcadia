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
import { GroupsTable } from './GroupsTable/GroupsTable';
import { exportGroups, getGroups } from '../state/actions';
import { groupsReducerSelector } from '../state/selectors';
import { GroupsFilters } from './GroupsFilters/GroupsFilters';
import { IGetGroupsRequestFiltersParams } from '../types';
import { GroupsCommandBar } from './GroupsCommandBar/GroupsCommandBar';
import { GroupsDialogForm } from './GroupsDialogForm/GroupsDialogForm';

const Groups = () => {
  const dispatch = useDispatch();
  const {
    isLoading, isExporting, total, ids, entities,
  } = useSelector(groupsReducerSelector);
  const searchParams = useSearchParams();

  const { handleFiltersSubmit } = useFilter<IGetGroupsRequestFiltersParams>();
  const { forcePage, handlePageChange, offset } = usePagination();
  const { handleExport } = useExport(total, exportGroups);

  useEffect(() => {
    dispatch(getGroups({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  return (
    <>
      <ModuleWrapper
        commandBar={(
          <GroupsCommandBar />
        )}
        filters={(
          <GroupsFilters
            total={total}
            isExporting={isExporting}
            isExportDisabled={isLoading}
            initialValues={searchParams}
            onFiltersSubmit={handleFiltersSubmit}
            onExport={handleExport}
          />
        )}
        table={(
          <GroupsTable
            total={total}
            offset={offset}
            ids={ids}
            isLoading={isLoading}
            entities={entities}
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
      <GroupsDialogForm />
    </>
  );
};

export default Groups;
