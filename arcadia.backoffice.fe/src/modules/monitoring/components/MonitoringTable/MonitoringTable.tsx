import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ExpandBtn,
  useTableSortingWithRouting,
  useExpand,
} from 'arcadia-common-fe';
import { IMonitoringList, MonitoringId } from '../../types';
import { MonitoringStatus } from './MonitoringStatus/MonitoringStatus';
import { MonitoringDetails } from './MonitoringDetails/MonitoringDetails';
import { setMonitoringDialogAction, setMonitoringDialogForm } from '../../state/actions';
import { MonitoringDialogAction } from './MonitoringDialogAction/MonitoringDialogAction';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { getHistoryData } from '../../../history/state/actions';
import { HistoryType } from '../../../history/types';

interface IMonitoringTableProps {
  isLoading: boolean
  total: number
  offset: number
  monitoring: IMonitoringList
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'segment', label: 'Segment' },
  { key: 'segmentSubset', label: 'Segment subset' },
  { key: 'mode', label: 'Mode' },
  { key: 'metric', label: 'Metric' },
  { key: 'dimension', label: 'Dimension' },
  { key: 'targetValue', label: 'Target value' },
  { key: 'currentValue', label: 'Current value' },
  { key: 'alertLowThreshold', label: 'Alert low threshold' },
  { key: 'alertHighThreshold', label: 'Alert high threshold' },
  { key: 'cutoffLowThreshold', label: 'Cutoff low threshold' },
  { key: 'cutoffHighThreshold', label: 'Cutoff high threshold' },
];

export const MonitoringTable: React.FC<IMonitoringTableProps> = ({
  isLoading,
  total,
  offset,
  monitoring,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const {
    handleExpand, handleResetExpand, isExpanded,
  } = useExpand();

  const handleEdit = useCallback((id: MonitoringId) => {
    const initialMonitoring = monitoring.find((item) => item.id === id);

    dispatch(setMonitoringDialogForm({
      isOpen: true,
      initialValues: initialMonitoring,
    }));
  }, [monitoring]);

  const handleRemove = useCallback((id: MonitoringId) => {
    dispatch(setMonitoringDialogAction({
      id,
      isOpen: true,
    }));
  }, []);

  const renderSubSegments = useCallback((segmentSubset) => Object.keys(segmentSubset).map((key) => {
    if (segmentSubset[key]) {
      return (
        <div key={key}>
          {key}
          :&nbsp;
          {segmentSubset[key]}
        </div>
      );
    }

    return null;
  }), []);

  const handleOpenHistory = useCallback((id) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.monitoring,
    }));
  }, []);

  useEffect(() => {
    handleResetExpand();
  }, [monitoring]);

  return (
    <>
      <Table
        isLoading={isLoading}
        count={total}
      >
        <TableHead>
          <TableRow>
            <TableCell isContentWidth />
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
            monitoring.map(({
              id,
              status,
              segment,
              segmentSubset,
              mode,
              metric,
              dimension,
              targetValue,
              currentValue,
              alertLowThreshold,
              alertHighThreshold,
              cutoffLowThreshold,
              cutoffHighThreshold,
            }, i) => (
              <TableRow
                key={id}
                isExpand={isExpanded(id)}
                expandComponent={(
                  <>
                    <TableCell colSpan={2} />
                    <TableCell className="monitoring-table__details-cell" colSpan={12}>
                      <MonitoringDetails
                        id={id}
                        onEdit={handleEdit}
                        onRemove={handleRemove}
                        onOpenHistory={handleOpenHistory}
                      />
                    </TableCell>
                  </>
                )}
                onExpand={() => handleExpand(id)}
              >
                <TableCell>{offset + i + 1}</TableCell>
                <TableCell>
                  <ExpandBtn isActive={isExpanded(id)} />
                </TableCell>
                <TableCell>
                  <MonitoringStatus status={status} />
                </TableCell>
                <TableCell>{segment}</TableCell>
                <TableCell>{renderSubSegments(segmentSubset)}</TableCell>
                <TableCell>{mode}</TableCell>
                <TableCell>{metric}</TableCell>
                <TableCell>{dimension}</TableCell>
                <TableCell>{targetValue}</TableCell>
                <TableCell>{currentValue}</TableCell>
                <TableCell>{alertLowThreshold}</TableCell>
                <TableCell>{alertHighThreshold}</TableCell>
                <TableCell>{cutoffLowThreshold}</TableCell>
                <TableCell>{cutoffHighThreshold}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <MonitoringDialogAction />
      <HistoryDialog />
    </>
  );
};
