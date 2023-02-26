import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, useTableSortingWithRouting,
} from 'arcadia-common-fe';
import { IPlayerBlocksReport } from '../../types';

interface IPlayerBlocksReportTableProps {
  isLoading: boolean
  total: number
  offset: number
  data: IPlayerBlocksReport
}

const headCells = [
  { key: 'grouping_value', label: 'Grouping value' },
  { key: 'total_blocked', label: 'Blocked' },
  { key: 'total_unblocked', label: 'Unblocked' },
];

export const PlayerBlocksReportTable: React.FC<IPlayerBlocksReportTableProps> = ({
  isLoading,
  total,
  offset,
  data,
}) => {
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();

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
              sortOrder={sortBy === key ? sortOrder : undefined}
              onClick={createSortHandler(key)}
            >
              { label }
            </TableCell>
          )) }
        </TableRow>
      </TableHead>

      <TableBody>
        {
          data.map((report, i) => (
            <TableRow key={report.grouping_value}>
              <TableCell>{offset + i + 1}</TableCell>
              <TableCell>{report.grouping_value}</TableCell>
              <TableCell>{report.total_blocked}</TableCell>
              <TableCell>{report.total_unblocked}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
