import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ExpandBtn,
  CheckboxBase,
  useTableItemsSelection,
  useTableSortingWithRouting,
  useExpand,
  getDateTimeFormatted,
  VouchersStatus,
  VoucherID,
  IVouchersEntities,
} from 'arcadia-common-fe';
import { VoucherDetails } from './VoucherDetails/VoucherDetails';
import { selectedVouchersSelector } from '../../state/selectors';
import { setSelectedVouchers } from '../../state/actions';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { getHistoryData } from '../../../history/state/actions';
import { HistoryType } from '../../../history/types';
import './VouchersTable.scss';

interface IVouchersTableProps {
  isLoading: boolean
  total: number
  offset: number
  ids: VoucherID[]
  entities: IVouchersEntities
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'id', label: 'Voucher ID' },
  { key: 'operatorName', label: 'Operator Name' },
  { key: 'playerCid', label: 'Player CID' },
  { key: 'groupName', label: 'Group Name' },
  { key: 'grantedDate', label: 'Granted' },
  { key: 'expirationDate', label: 'Expiration' },
];

export const VouchersTable: React.FC<IVouchersTableProps> = ({
  isLoading,
  total,
  offset,
  ids,
  entities,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const { handleExpand, handleResetExpand, isExpanded } = useExpand();
  const {
    handleSelectItem,
    isItemSelected,
    handleSelectAll,
    isSelectedAll,
  } = useTableItemsSelection<VoucherID>(selectedVouchersSelector, setSelectedVouchers);

  useEffect(() => {
    handleResetExpand();

    return () => {
      dispatch(setSelectedVouchers([]));
    };
  }, [entities]);

  const handleOpenHistory = useCallback((id: VoucherID) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.vouchers,
    }));
  }, []);

  return (
    <>
      <Table
        isLoading={isLoading}
        count={total}
      >
        <TableHead>
          <TableRow>
            <TableCell isContentWidth />
            <TableCell isContentWidth>
              <CheckboxBase
                value={isSelectedAll(ids)}
                onChange={(value, event) => {
                  event.stopPropagation();
                  handleSelectAll(ids);
                }}
              />
            </TableCell>
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
            ids.map((id, i) => {
              const voucher = entities[id];

              return (
                <TableRow
                  key={id}
                  isExpand={isExpanded(id)}
                  expandComponent={(
                    <>
                      <TableCell colSpan={2} />
                      <TableCell className="vouchers-table__details-cell" colSpan={8}>
                        <VoucherDetails {...voucher} onOpenHistory={handleOpenHistory} />
                      </TableCell>
                    </>
                  )}
                  onExpand={() => handleExpand(id)}
                >
                  <TableCell>{offset + i + 1}</TableCell>
                  <TableCell>
                    <CheckboxBase
                      value={isItemSelected(id)}
                      onChange={(value, event) => {
                        event.stopPropagation();
                        handleSelectItem(id);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <ExpandBtn isActive={isExpanded(id)} />
                  </TableCell>
                  <TableCell>
                    <VouchersStatus status={voucher.status} />
                  </TableCell>
                  <TableCell>{voucher.id}</TableCell>
                  <TableCell>{voucher.operatorName}</TableCell>
                  <TableCell>{voucher.playerCid}</TableCell>
                  <TableCell>{voucher.groupName}</TableCell>
                  <TableCell>
                    { getDateTimeFormatted(voucher.grantedDate) }
                  </TableCell>
                  <TableCell>
                    { getDateTimeFormatted(voucher.expirationDate) }
                  </TableCell>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
      <HistoryDialog />
    </>
  );
};
