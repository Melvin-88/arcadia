import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, useTableSortingWithRouting,
} from 'arcadia-common-fe';
import { IRevenueReport } from '../../types';

interface IRevenueReportTableProps {
  isLoading: boolean
  total: number
  offset: number
  data: IRevenueReport
}

const headCells = [
  { key: 'grouping_value', label: 'Grouping value' },
  { key: 'total_unique_players', label: 'Players' },
  { key: 'total_new_players', label: 'New players' },
  { key: 'total_bets', label: 'Bets' },
  { key: 'total_wins', label: 'Wins' },
  { key: 'total_voucher_bets', label: 'Voucher bets' },
  { key: 'total_voucher_wins', label: 'Voucher wins' },
  { key: 'total_refunds', label: 'Refunds' },
  { key: 'total_gross_gaming', label: 'Gross gaming' },
  { key: 'total_net_gaming', label: 'Net gaming' },
  { key: 'arpu', label: 'ARPU' },
];

export const RevenueReportTable: React.FC<IRevenueReportTableProps> = ({
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
              <TableCell>{report.total_unique_players}</TableCell>
              <TableCell>{report.total_new_players}</TableCell>
              <TableCell>{report.total_bets}</TableCell>
              <TableCell>{report.total_wins}</TableCell>
              <TableCell>{report.total_voucher_bets}</TableCell>
              <TableCell>{report.total_voucher_wins}</TableCell>
              <TableCell>{report.total_refunds}</TableCell>
              <TableCell>{report.total_gross_gaming}</TableCell>
              <TableCell>{report.total_net_gaming}</TableCell>
              <TableCell>{report.arpu}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
