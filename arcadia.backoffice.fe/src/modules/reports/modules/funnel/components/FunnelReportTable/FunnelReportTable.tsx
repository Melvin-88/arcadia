import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, useTableSortingWithRouting,
} from 'arcadia-common-fe';
import { IFunnelReport } from '../../types';

interface IFunnelReportTableProps {
  isLoading: boolean
  total: number
  offset: number
  data: IFunnelReport
}

const headCells = [
  { key: 'grouping_value', label: 'Grouping value' },
  { key: 'total_unique_players', label: '# players' },
  { key: 'total_unique_sessions', label: '# sessions' },
  { key: 'total_session_time', label: 'Total session time' },
  { key: 'avg_session_time', label: 'Avg session time' },
  { key: 'total_rounds_played', label: 'Rounds' },
  { key: 'avg_rounds_per_session', label: 'Avg rounds per session' },
  { key: 'total_watch_time', label: 'Watch time' },
  { key: 'avg_watch_time', label: 'Avg watch time' },
  { key: 'max_watch_time', label: 'Max watch time' },
  { key: 'total_queue_time', label: 'Queue time' },
  { key: 'avg_queue_time', label: 'Avg queue time' },
  { key: 'max_queue_time', label: 'Max queue time' },
  { key: 'total_in_play_time', label: 'In play time' },
  { key: 'avg_in_play_time', label: 'Avg in play time' },
  { key: 'max_in_play_time', label: 'Max in play time' },
  { key: 'total_sessions_watch', label: '# sessions watch' },
  { key: 'percent_sessions_watch', label: '% sessions watch' },
  { key: 'total_sessions_queue', label: '# sessions queue' },
  { key: 'percent_sessions_queue', label: '% sessions queue' },
  { key: 'total_sessions_behind', label: '# sessions behind' },
  { key: 'percent_sessions_behind', label: '% sessions behind' },
  { key: 'total_sessions_in_play', label: '# sessions in play' },
  { key: 'percent_sessions_in_play', label: '% sessions in plays' },
  { key: 'total_sessions_change_denomination', label: '# sessions change denomination' },
  { key: 'percent_sessions_change_denomination', label: '% sessions change denomination' },
];

export const FunnelReportTable: React.FC<IFunnelReportTableProps> = ({
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
              <TableCell>{report.total_unique_sessions}</TableCell>
              <TableCell>{report.total_session_time}</TableCell>
              <TableCell>{report.avg_session_time}</TableCell>
              <TableCell>{report.total_rounds_played}</TableCell>
              <TableCell>{report.avg_rounds_per_session}</TableCell>
              <TableCell>{report.total_watch_time}</TableCell>
              <TableCell>{report.avg_watch_time}</TableCell>
              <TableCell>{report.max_watch_time}</TableCell>
              <TableCell>{report.total_queue_time}</TableCell>
              <TableCell>{report.avg_queue_time}</TableCell>
              <TableCell>{report.max_queue_time}</TableCell>
              <TableCell>{report.total_in_play_time}</TableCell>
              <TableCell>{report.avg_in_play_time}</TableCell>
              <TableCell>{report.max_in_play_time}</TableCell>
              <TableCell>{report.total_sessions_watch}</TableCell>
              <TableCell>{report.percent_sessions_watch}</TableCell>
              <TableCell>{report.total_sessions_queue}</TableCell>
              <TableCell>{report.percent_sessions_queue}</TableCell>
              <TableCell>{report.total_sessions_behind}</TableCell>
              <TableCell>{report.percent_sessions_behind}</TableCell>
              <TableCell>{report.total_sessions_in_play}</TableCell>
              <TableCell>{report.percent_sessions_in_play}</TableCell>
              <TableCell>{report.total_sessions_change_denomination}</TableCell>
              <TableCell>{report.percent_sessions_change_denomination}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
