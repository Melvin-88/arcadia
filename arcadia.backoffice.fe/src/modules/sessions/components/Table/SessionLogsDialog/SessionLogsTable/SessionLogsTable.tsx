import React, { useCallback } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, ISortData, getDateTimeFormatted, convertDataToJSON,
} from 'arcadia-common-fe';
import { ISessionLogs } from '../../../../types';
import { sessionLogSourceLabelMap } from '../../../../constants';
import './SessionLogsTable.scss';

export interface ISessionLogsTableProps {
  isLoading?: boolean
  logs: ISessionLogs
  total: number
  sortData: ISortData
  onSort: (key: string) => void
}

const headCells = [
  { key: 'createdDate', label: 'Created Date' },
  { key: 'source', label: 'Source' },
  { key: 'type', label: 'Type' },
];

export const SessionLogsTable: React.FC<ISessionLogsTableProps> = ({
  isLoading,
  logs,
  total,
  sortData,
  onSort,
}) => {
  const createSortHandler = useCallback((key: string) => () => {
    onSort(key);
  }, [onSort]);

  return (
    <Table
      className="session-logs-table"
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
          <TableCell>Parameters</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {
          logs.map(({
            type, source, createdDate, parameters,
          }, i) => (
            <TableRow key={type + source + createdDate + parameters}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{getDateTimeFormatted(createdDate)}</TableCell>
              <TableCell>{sessionLogSourceLabelMap[source]}</TableCell>
              <TableCell>{type}</TableCell>
              <TableCell>{convertDataToJSON(parameters)}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
