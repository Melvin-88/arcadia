import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, useTableSortingWithRouting,
} from 'arcadia-common-fe';
import { IVouchersReport } from '../../types';

interface IVouchersReportTableProps {
  isLoading: boolean
  total: number
  offset: number
  data: IVouchersReport
}

const headCells = [
  { key: 'grouping_value', label: 'Grouping value' },
  { key: 'total_vouchers_issued', label: 'Vouchers issued' },
  { key: 'total_vouchers_used', label: 'Vouchers used' },
  { key: 'total_vouchers_bets', label: 'Vouchers bets' },
  { key: 'total_vouchers_wins', label: 'Vouchers wins' },
  { key: 'total_vouchers_expired', label: 'Vouchers expired' },
  { key: 'total_vouchers_canceled', label: 'Vouchers cancelled' },
  { key: 'total_rounds_played', label: 'Rounds played' },
];

export const VouchersReportTable: React.FC<IVouchersReportTableProps> = ({
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
              <TableCell>{report.total_vouchers_issued}</TableCell>
              <TableCell>{report.total_vouchers_used}</TableCell>
              <TableCell>{report.total_vouchers_bets}</TableCell>
              <TableCell>{report.total_vouchers_wins}</TableCell>
              <TableCell>{report.total_vouchers_expired}</TableCell>
              <TableCell>{report.total_vouchers_canceled}</TableCell>
              <TableCell>{report.total_rounds_played}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
