import React, { useCallback } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  convertDataToJSON,
  ISortData,
  getDateTimeFormatted,
} from 'arcadia-common-fe';
import { UserActions } from '../../../types';

export interface IAdministrationTableUserActionsProps {
  isLoading?: boolean
  actions: UserActions
  total: number
  sortData: ISortData
  onSort: (key: string) => void
}

const headCells = [
  { key: 'id', label: 'Entity ID' },
  { key: 'path', label: 'Path' },
  { key: 'ip', label: 'Ip' },
  { key: 'date', label: 'Date' },
];

export const AdministrationTableUserActions: React.FC<IAdministrationTableUserActionsProps> = ({
  isLoading,
  actions,
  total,
  sortData,
  onSort,
}) => {
  const createSortHandler = useCallback((key: string) => () => {
    onSort(key);
  }, [onSort]);

  return (
    <Table
      isLoading={isLoading}
      count={total}
    >
      <TableHead>
        <TableRow>
          <TableCell isContentWidth />
          { headCells.map(({ key, label }) => (
            <TableCell
              key={key}
              sortOrder={sortData.sortBy === key ? sortData.sortOrder : undefined}
              onClick={createSortHandler(key)}
            >
              { label }
            </TableCell>
          )) }
          <TableCell>Action</TableCell>
          <TableCell>Previous data</TableCell>
          <TableCell>New Entity data</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {
          actions.map((action, i) => (
            <TableRow key={action.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{action.id}</TableCell>
              <TableCell>{action.path}</TableCell>
              <TableCell>{action.ip}</TableCell>
              <TableCell>{getDateTimeFormatted(action.date)}</TableCell>
              <TableCell>{action.changes.map((item) => item.action)}</TableCell>
              <TableCell>{action.changes.map((item) => convertDataToJSON(item.previousData))}</TableCell>
              <TableCell>{action.changes.map((item) => convertDataToJSON(item.newData))}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
