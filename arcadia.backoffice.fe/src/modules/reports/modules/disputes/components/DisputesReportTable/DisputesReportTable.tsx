import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, useTableSortingWithRouting,
} from 'arcadia-common-fe';
import { IDisputesReport } from '../../types';

interface IDisputesReportTableProps {
  isLoading: boolean
  total: number
  offset: number
  data: IDisputesReport
}

const headCells = [
  { key: 'grouping_value', label: 'Grouping value' },
  { key: 'total_dispute_count', label: 'Total dispute count' },
];

export const DisputesReportTable: React.FC<IDisputesReportTableProps> = ({
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
              <TableCell>{report.total_dispute_count}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
