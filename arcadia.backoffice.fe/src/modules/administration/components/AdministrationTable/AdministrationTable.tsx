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
  covertBooleanToYesNo,
} from 'arcadia-common-fe';
import { IUsers, AdministrationAction, UserId } from '../../types';
import { AdministrationStatus } from '../AdministrationStatus/AdministrationStatus';
import { AdministrationDetails } from './AdministrationDetails/AdministrationDetails';
import { AdministrationDialogAction } from './AdministrationDialogAction/AdministrationDialogAction';
import { AdministrationDialogEditPassword } from './AdministrationDialogEditPassword/AdministrationDialogEditPassword';
import { AdministrationDialogFindChip } from '../AdministrationDialogFindChip/AdministrationDialogFindChip';
import {
  setAdministrationDialogForm,
  setAdministrationDialogAction,
  setAdministrationDialogEditPassword,
  setAdministrationDialogUserActions,
} from '../../state/actions';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { getHistoryData } from '../../../history/state/actions';
import { HistoryType } from '../../../history/types';

interface IAdministrationTableProps {
  isLoading: boolean
  total: number
  offset: number
  users: IUsers
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'id', label: 'User ID' },
  { key: 'isAdmin', label: 'Is Admin' },
  { key: 'userName', label: 'User Name' },
  { key: 'lastAccessDate', label: 'Last Access' },
  { key: 'lastAccessIp', label: 'Last Access IP' },
];

export const AdministrationTable: React.FC<IAdministrationTableProps> = ({
  isLoading,
  total,
  offset,
  users,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const { handleExpand, handleResetExpand, isExpanded } = useExpand();

  const handleEdit = useCallback((id: UserId) => {
    const user = users.find((item) => item.id === id);

    dispatch(setAdministrationDialogForm({
      isOpen: true,
      initialValues: user,
    }));
  }, [users]);

  const handleEditPassword = useCallback((id: UserId) => {
    dispatch(setAdministrationDialogEditPassword({
      id,
      isOpen: true,
    }));
  }, []);

  useEffect(() => {
    handleResetExpand();
  }, [users]);

  const handleSetDialogAction = useCallback((id: UserId, action: AdministrationAction) => {
    dispatch(setAdministrationDialogAction({
      id,
      action,
      isOpen: true,
    }));
  }, []);

  const handleEnable = useCallback((id: UserId) => {
    handleSetDialogAction(id, AdministrationAction.enable);
  }, [handleSetDialogAction]);

  const handleDisable = useCallback((id: UserId) => {
    handleSetDialogAction(id, AdministrationAction.disable);
  }, [handleSetDialogAction]);

  const handleRemove = useCallback((id: UserId) => {
    handleSetDialogAction(id, AdministrationAction.remove);
  }, [handleSetDialogAction]);

  const handleOpenHistory = useCallback((id) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.administration,
    }));
  }, []);

  const handleUserActions = useCallback((id: UserId) => {
    dispatch(setAdministrationDialogUserActions({
      id,
      isOpen: true,
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
            users.map((user, i) => (
              <TableRow
                key={user.id}
                isExpand={isExpanded(user.id)}
                expandComponent={(
                  <>
                    <TableCell colSpan={2} />
                    <TableCell className="administration-table__details-cell" colSpan={7}>
                      <AdministrationDetails
                        {...user}
                        onEdit={handleEdit}
                        onEnable={handleEnable}
                        onDisable={handleDisable}
                        onRemove={handleRemove}
                        onUserActions={handleUserActions}
                        onEditPassword={handleEditPassword}
                        onOpenHistory={handleOpenHistory}
                      />
                    </TableCell>
                  </>
                )}
                onExpand={() => handleExpand(user.id)}
              >
                <TableCell>{offset + i + 1}</TableCell>
                <TableCell>
                  <ExpandBtn isActive={isExpanded(user.id)} />
                </TableCell>
                <TableCell>
                  <AdministrationStatus status={user.status} />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{covertBooleanToYesNo(user.isAdmin)}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{getDateTimeFormatted(user.lastAccessDate)}</TableCell>
                <TableCell>{user.lastAccessIp}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <AdministrationDialogAction />
      <AdministrationDialogEditPassword />
      <AdministrationDialogFindChip />
      <HistoryDialog />
    </>
  );
};
