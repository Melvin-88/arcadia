import React, { useCallback } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ISortData,
  Button,
  getDateTimeFormatted,
  ButtonColor,
  useHistoryPush,
  convertDataToJSON,
} from 'arcadia-common-fe';
import { useDispatch } from 'react-redux';
import { IProcessedReport, IProcessedReports, IProcessedReportsRequestFiltersParams } from '../../types';
import { ProcessedReportStatus } from './ProcessedReportStatus/ProcessedReportStatus';
import { setProcessedReportsDialog } from '../../state/actions';

export interface IProcessedReportsDialogTableProps {
  isLoading?: boolean
  data: IProcessedReports
  total: number
  sortData: ISortData
  onSort: (key: string) => void
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'reportType', label: 'Report Type' },
  { key: 'requestedDateTime', label: 'Requested Date Time' },
  { key: 'params', label: 'Applied filters' },
];

export const ProcessedReportsDialogTable: React.FC<IProcessedReportsDialogTableProps> = ({
  isLoading,
  data,
  total,
  sortData,
  onSort,
}) => {
  const dispatch = useDispatch();
  const { handleHistoryPush } = useHistoryPush();

  const createSortHandler = useCallback((key: string) => () => {
    onSort(key);
  }, [onSort]);

  const handleLoadProcessedReports = useCallback((params: IProcessedReportsRequestFiltersParams) => {
    handleHistoryPush(params);
    dispatch(setProcessedReportsDialog());
  }, []);

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
          <TableCell isContentWidth />
        </TableRow>
      </TableHead>

      <TableBody>
        {
          data.map((item: IProcessedReport, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                <ProcessedReportStatus status={item.status} />
              </TableCell>
              <TableCell>{item.reportType}</TableCell>
              <TableCell>{getDateTimeFormatted(item.requestedDateTime)}</TableCell>
              <TableCell>{convertDataToJSON(item.params)}</TableCell>
              <TableCell>
                <Button
                  color={ButtonColor.tertiary}
                  onClick={() => handleLoadProcessedReports(item.params)}
                >
                  Load
                </Button>
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
