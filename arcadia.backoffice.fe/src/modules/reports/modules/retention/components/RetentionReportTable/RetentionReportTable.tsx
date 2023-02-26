import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, useTableSortingWithRouting,
} from 'arcadia-common-fe';
import { IRetentionReport } from '../../types';

interface IRetentionReportTableProps {
  isLoading: boolean
  total: number
  offset: number
  data: IRetentionReport
}

const headCells = [
  { key: 'grouping_value', label: 'Grouping value' },
  { key: 'r1', label: 'R1' },
  { key: 'r2', label: 'R2' },
  { key: 'r7', label: 'R7' },
  { key: 'r14', label: 'R14' },
  { key: 'r30', label: 'R30' },
];

export const RetentionReportTable: React.FC<IRetentionReportTableProps> = ({
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
              <TableCell>{report.r1}</TableCell>
              <TableCell>{report.r2}</TableCell>
              <TableCell>{report.r7}</TableCell>
              <TableCell>{report.r14}</TableCell>
              <TableCell>{report.r30}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
