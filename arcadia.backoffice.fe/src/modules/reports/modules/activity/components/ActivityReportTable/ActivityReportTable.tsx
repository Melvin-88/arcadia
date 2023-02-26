import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, useTableSortingWithRouting,
} from 'arcadia-common-fe';
import { IActivityReport } from '../../types';

interface IActivityReportTableProps {
  isLoading: boolean
  total: number
  offset: number
  data: IActivityReport
}

const headCells = [
  { key: 'grouping_value', label: 'Grouping value' },
  { key: 'total_unique_players', label: '# players' },
  { key: 'total_new_players', label: '# new players' },
  { key: 'total_unique_sessions', label: '# sessions' },
  { key: 'total_session_time', label: 'Total session time' },
  { key: 'avg_session_time', label: 'Avg session time' },
  { key: 'total_rounds_played', label: 'Rounds' },
  { key: 'avg_rounds_per_session', label: 'Avg rounds per session' },
  { key: 'total_bets', label: 'Bets' },
  { key: 'total_wins', label: 'Wins' },
  { key: 'total_behind_bets', label: 'Bets behind' },
  { key: 'total_behind_wins', label: 'Wins behind' },
  { key: 'total_voucher_bets', label: 'Voucher bets' },
  { key: 'total_voucher_wins', label: 'Voucher wins' },
  { key: 'total_refunds', label: 'Refunds' },
  { key: 'total_gross_gaming', label: 'Gross gaming' },
  { key: 'total_net_gaming', label: 'Net gaming' },
  { key: 'total_watch_time', label: 'Watch time' },
  { key: 'avg_watch_time', label: 'Avg watch time' },
  { key: 'max_watch_time', label: 'Max watch time' },
  { key: 'total_queue_time', label: 'Queue time' },
  { key: 'avg_queue_time', label: 'Avg queue time' },
  { key: 'max_queue_time', label: 'Max queue time' },
  { key: 'total_in_play_time', label: 'In play time' },
  { key: 'avg_in_play_time', label: 'Average in play time' },
  { key: 'max_in_play_time', label: 'Max in play time' },
  { key: 'total_autoplay_bets', label: 'Autoplay bets' },
  { key: 'total_autoplay_wins', label: 'Autoplay wins' },
  { key: 'percent_autoplay_sessions', label: 'Autoplay % of sessions' },
  { key: 'total_sessions_watch', label: '# sessions watch' },
  { key: 'percent_sessions_watch', label: 'Sessions watch %' },
  { key: 'total_sessions_queue', label: '# sessions queue' },
  { key: 'percent_sessions_queue', label: 'Sessions queue %' },
  { key: 'total_sessions_behind', label: '# sessions behind' },
  { key: 'percent_sessions_behind', label: 'Sessions behind %' },
  { key: 'total_sessions_in_play', label: '# sessions in play' },
  { key: 'percent_sessions_in_play', label: 'Sessions in play %' },
];

export const ActivityReportTable: React.FC<IActivityReportTableProps> = ({
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
              <TableCell>{report.total_unique_sessions}</TableCell>
              <TableCell>{report.total_session_time}</TableCell>
              <TableCell>{report.avg_session_time}</TableCell>
              <TableCell>{report.total_rounds_played}</TableCell>
              <TableCell>{report.avg_rounds_per_session}</TableCell>
              <TableCell>{report.total_bets}</TableCell>
              <TableCell>{report.total_wins}</TableCell>
              <TableCell>{report.total_behind_bets}</TableCell>
              <TableCell>{report.total_behind_wins}</TableCell>
              <TableCell>{report.total_voucher_bets}</TableCell>
              <TableCell>{report.total_voucher_wins}</TableCell>
              <TableCell>{report.total_refunds}</TableCell>
              <TableCell>{report.total_gross_gaming}</TableCell>
              <TableCell>{report.total_net_gaming}</TableCell>
              <TableCell>{report.total_watch_time}</TableCell>
              <TableCell>{report.avg_watch_time}</TableCell>
              <TableCell>{report.max_watch_time}</TableCell>
              <TableCell>{report.total_queue_time}</TableCell>
              <TableCell>{report.avg_queue_time}</TableCell>
              <TableCell>{report.max_queue_time}</TableCell>
              <TableCell>{report.total_in_play_time}</TableCell>
              <TableCell>{report.avg_in_play_time}</TableCell>
              <TableCell>{report.max_in_play_time}</TableCell>
              <TableCell>{report.total_autoplay_bets}</TableCell>
              <TableCell>{report.total_autoplay_wins}</TableCell>
              <TableCell>{report.percent_autoplay_sessions}</TableCell>
              <TableCell>{report.total_sessions_watch}</TableCell>
              <TableCell>{report.percent_sessions_watch}</TableCell>
              <TableCell>{report.total_sessions_queue}</TableCell>
              <TableCell>{report.percent_sessions_queue}</TableCell>
              <TableCell>{report.total_sessions_behind}</TableCell>
              <TableCell>{report.percent_sessions_behind}</TableCell>
              <TableCell>{report.total_sessions_in_play}</TableCell>
              <TableCell>{report.percent_sessions_in_play}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
