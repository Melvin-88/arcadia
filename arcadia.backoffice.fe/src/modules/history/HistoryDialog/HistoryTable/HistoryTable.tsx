import React, { useCallback } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  convertDataToJSON,
  ISortData,
} from 'arcadia-common-fe';
import { IHistoryList, IHistory } from '../../types';

export interface IHistoryTableProps {
  isLoading?: boolean
  history: IHistoryList
  total: number
  offset: number
  sortData: ISortData
  onSort: (key: string) => void
}

const headCells = [
  { key: 'date', label: 'Date & Time' },
  { key: 'action', label: 'Source' },
  { key: 'id', label: 'User ID' },
];

export const HistoryTable: React.FC<IHistoryTableProps> = ({
  isLoading,
  history,
  total,
  offset,
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
          <TableCell>Previous Data</TableCell>
          <TableCell>New Data</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {
          history.map((item: IHistory, i) => (
            <TableRow key={item.date + item.action + item.user.id}>
              <TableCell>{offset + i + 1}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.action}</TableCell>
              <TableCell>{item.user.name}</TableCell>
              <TableCell>{convertDataToJSON(item.previousData)}</TableCell>
              <TableCell>{convertDataToJSON(item.newData)}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
