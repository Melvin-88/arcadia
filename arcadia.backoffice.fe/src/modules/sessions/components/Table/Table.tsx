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
  formatSecondsToMinutesSeconds,
  convertDataToJSON,
  formatDenominator,
} from 'arcadia-common-fe';
import { SessionDetails } from './SessionDetails/SessionDetails';
import { ISession, ISessions, SessionId } from '../../types';
import { SessionLogsDialog } from './SessionLogsDialog/SessionLogsDialog';
import { TerminateDialog } from './TerminateDialog/TerminateDialog';
import { openTerminateDialog, setSessionLogsDialog } from '../../actions';
import { SessionsStatus } from './SessionsStatus/SessionsStatus';
import { setDialogJSONViewer } from '../../../DialogJSONViewer/actions';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { getHistoryData } from '../../../history/state/actions';
import { HistoryType } from '../../../history/types';
import './Table.scss';

interface ISessionsTableProps {
  isLoading: boolean
  total: number
  offset: number
  sessions: ISessions
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'id', label: 'Session ID' },
  { key: 'groupName', label: 'Group Name' },
  { key: 'machineId', label: 'Machine ID' },
  { key: 'operatorName', label: 'Operator Name' },
  { key: 'playerCid', label: 'Player CID' },
  { key: 'ip', label: 'IP Address' },
  { key: 'startDate', label: 'Start Date & Time' },
  { key: 'duration', label: 'Duration' },
  { key: 'rounds', label: 'Rounds' },
  { key: 'totalWinning', label: 'Total Winning' },
  { key: 'totalNetCash', label: 'Total Netgaming' },
];

export const SessionsTable: React.FC<ISessionsTableProps> = ({
  isLoading,
  total,
  offset,
  sessions,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const { handleExpand, handleResetExpand, isExpanded } = useExpand();

  const handleOpenTerminate = useCallback((id: number) => {
    dispatch(openTerminateDialog({ id }));
  }, [openTerminateDialog]);

  const handleOpenLogs = useCallback((session: ISession) => {
    dispatch(setSessionLogsDialog({ session, isOpen: true }));
  }, []);

  const handleOpenGroupSettingsJSON = useCallback((id: SessionId) => {
    const currentSession = sessions.find((player: ISession) => player.id === id);

    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(currentSession?.groupSettings),
    }));
  }, [sessions]);

  const handleOpenOperatorSettingsJSON = useCallback((id: SessionId) => {
    const currentSession = sessions.find((player: ISession) => player.id === id);

    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(currentSession?.operatorSettings),
    }));
  }, [sessions]);

  const handleOpenSystemSettingsJSON = useCallback((id: SessionId) => {
    const currentSession = sessions.find((player: ISession) => player.id === id);

    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(currentSession?.systemSettings),
    }));
  }, [sessions]);

  const handleOpenHistory = useCallback((id) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.sessions,
    }));
  }, []);

  useEffect(() => {
    handleResetExpand();
  }, [sessions]);

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
            sessions.map((session, i) => (
              <TableRow
                key={session.id}
                isExpand={isExpanded(session.id)}
                expandComponent={(
                  <>
                    <TableCell colSpan={2} />
                    <TableCell colSpan={12}>
                      <SessionDetails
                        session={session}
                        onTerminate={handleOpenTerminate}
                        onOpenLogs={handleOpenLogs}
                        onOpenGroupSettingsJSON={handleOpenGroupSettingsJSON}
                        onOpenOperatorSettingsJSON={handleOpenOperatorSettingsJSON}
                        onOpenSystemSettingsJSON={handleOpenSystemSettingsJSON}
                        onOpenHistory={handleOpenHistory}
                      />
                    </TableCell>
                  </>
                )}
                onExpand={() => handleExpand(session.id)}
              >
                <TableCell>{offset + i + 1}</TableCell>
                <TableCell>
                  <ExpandBtn isActive={isExpanded(session.id)} />
                </TableCell>
                <TableCell>
                  <SessionsStatus status={session.status} />
                </TableCell>
                <TableCell>{session.id}</TableCell>
                <TableCell className="sessions-table__group_name">
                  {session.groupName}
                </TableCell>
                <TableCell>{session.machineId}</TableCell>
                <TableCell>{session.operatorName}</TableCell>
                <TableCell>{session.playerCid}</TableCell>
                <TableCell>{session.ip}</TableCell>
                <TableCell>
                  { getDateTimeFormatted(session.startDate) }
                </TableCell>
                <TableCell>
                  { formatSecondsToMinutesSeconds(session.duration) }
                </TableCell>
                <TableCell>{session.rounds}</TableCell>
                <TableCell>
                  { formatDenominator(session.totalWinning) }
                </TableCell>
                <TableCell>
                  { formatDenominator(session.totalNetCash) }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <SessionLogsDialog />
      <TerminateDialog />
      <HistoryDialog />
    </>
  );
};
