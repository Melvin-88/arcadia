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
  getDateTimeFormatted,
  formatCurrency,
} from 'arcadia-common-fe';
import { IDisputes } from '../../types';
import { DisputesStatus } from './DisputesStatus/DisputesStatus';
import { DisputeDetails } from './DisputeDetails/DisputeDetails';
import { setDisputeDialogForm } from '../../state/actions';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { getHistoryData } from '../../../history/state/actions';
import { HistoryType } from '../../../history/types';
import './DisputesTable.scss';

interface IDisputesTableProps {
  isLoading: boolean
  total: number
  offset: number
  disputes: IDisputes
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'id', label: 'Dispute ID' },
  { key: 'operatorName', label: 'Operator Name' },
  { key: 'playerCid', label: 'Player CID' },
  { key: 'sessionId', label: 'Session ID' },
  { key: 'rebateSum', label: 'Rebate' },
  { key: 'openedAtDate', label: 'Opened Date & Time' },
  { key: 'closedDate', label: 'Closed Date & Time' },
];

export const DisputesTable: React.FC<IDisputesTableProps> = ({
  isLoading,
  total,
  offset,
  disputes,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const { handleExpand, handleResetExpand, isExpanded } = useExpand();

  const handleEdit = useCallback((id: number) => {
    const dispute = disputes.find((item) => item.id === id);

    dispatch(setDisputeDialogForm({
      isOpen: true,
      initialValues: dispute,
    }));
  }, [disputes]);

  const handleOpenHistory = useCallback((id) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.disputes,
    }));
  }, []);

  useEffect(() => {
    handleResetExpand();
  }, [disputes]);

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
            disputes.map((dispute, i) => (
              <TableRow
                key={dispute.id}
                isExpand={isExpanded(dispute.id)}
                expandComponent={(
                  <>
                    <TableCell colSpan={2} />
                    <TableCell className="disputes-table__details-cell" colSpan={8}>
                      <DisputeDetails
                        {...dispute}
                        onEdit={handleEdit}
                        onOpenHistory={handleOpenHistory}
                      />
                    </TableCell>
                  </>
                )}
                onExpand={() => handleExpand(dispute.id)}
              >
                <TableCell>{offset + i + 1}</TableCell>
                <TableCell>
                  <ExpandBtn isActive={isExpanded(dispute.id)} />
                </TableCell>
                <TableCell>
                  <DisputesStatus status={dispute.status} />
                </TableCell>
                <TableCell>{dispute.id}</TableCell>
                <TableCell>{dispute.operatorName}</TableCell>
                <TableCell>{dispute.playerCid}</TableCell>
                <TableCell>{dispute.sessionId}</TableCell>
                <TableCell>
                  { formatCurrency(dispute.rebateSum, dispute.rebateCurrency) }
                </TableCell>
                <TableCell>
                  { getDateTimeFormatted(dispute.openedAtDate) }
                </TableCell>
                <TableCell>
                  { getDateTimeFormatted(dispute.closedDate) }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <HistoryDialog />
    </>
  );
};
