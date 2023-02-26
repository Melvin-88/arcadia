import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, useTableSortingWithRouting,
} from 'arcadia-common-fe';
import { IMachineStatusReport } from '../../types';

interface IMachineStatusReportTableProps {
  isLoading: boolean
  total: number
  offset: number
  data: IMachineStatusReport
}

const headCells = [
  { key: 'grouping_value', label: 'Grouping value' },
  { key: 'total_machines', label: '# machines' },
  { key: 'total_available_time', label: 'Available time' },
  { key: 'percent_available_time', label: 'Available time %' },
  { key: 'total_in_play_time', label: 'In play time' },
  { key: 'percent_in_play_time', label: 'In play time %' },
  { key: 'total_offline_time', label: 'Offline time' },
  { key: 'percent_offline_time', label: 'Offline time %' },
  { key: 'total_stopped_time', label: 'Offline stopped time' },
  { key: 'percent_stopped_time', label: 'Stopped time %' },
  { key: 'total_shutting_down_time', label: 'Shutting down time' },
  { key: 'percent_shutting_down_time', label: 'Shutting down time %' },
  { key: 'total_preparing_time', label: 'Preparing time' },
  { key: 'percent_preparing_time', label: 'Preparing time %' },
  { key: 'total_ready_time', label: 'Ready time' },
  { key: 'percent_ready_time', label: 'Ready time %' },
  { key: 'total_seeding_time', label: 'Seeding time' },
  { key: 'percent_seeding_time', label: 'Seeding time %' },
  { key: 'total_on_hold_time', label: 'Hold time' },
  { key: 'percent_on_hold_time', label: 'Hold time %' },
];

export const MachineStatusReportTable: React.FC<IMachineStatusReportTableProps> = ({
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
              <TableCell>{report.total_machines}</TableCell>
              <TableCell>{report.total_available_time}</TableCell>
              <TableCell>{report.percent_available_time}</TableCell>
              <TableCell>{report.total_in_play_time}</TableCell>
              <TableCell>{report.percent_in_play_time}</TableCell>
              <TableCell>{report.total_offline_time}</TableCell>
              <TableCell>{report.percent_offline_time}</TableCell>
              <TableCell>{report.total_stopped_time}</TableCell>
              <TableCell>{report.percent_stopped_time}</TableCell>
              <TableCell>{report.total_shutting_down_time}</TableCell>
              <TableCell>{report.percent_shutting_down_time}</TableCell>
              <TableCell>{report.total_preparing_time}</TableCell>
              <TableCell>{report.percent_preparing_time}</TableCell>
              <TableCell>{report.total_ready_time}</TableCell>
              <TableCell>{report.percent_ready_time}</TableCell>
              <TableCell>{report.total_seeding_time}</TableCell>
              <TableCell>{report.percent_seeding_time}</TableCell>
              <TableCell>{report.total_on_hold_time}</TableCell>
              <TableCell>{report.percent_on_hold_time}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
