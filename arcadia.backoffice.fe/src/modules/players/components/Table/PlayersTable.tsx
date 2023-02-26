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
  convertDataToJSON,
} from 'arcadia-common-fe';
import {
  IPlayers, PlayerAction, PlayerCID, IPlayer,
} from '../../types';
import { PlayersStatus } from './PlayersStatus/PlayersStatus';
import { PlayerDetails } from './PlayerDetails/PlayerDetails';
import { PlayerDialogAction } from './PlayerDialogAction/PlayerDialogAction';
import { setPlayersDialogAction } from '../../state/actions';
import { setDialogJSONViewer } from '../../../DialogJSONViewer/actions';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { getHistoryData } from '../../../history/state/actions';
import { HistoryType } from '../../../history/types';

interface IPlayersTableProps {
  isLoading: boolean
  total: number
  offset: number
  players: IPlayers
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'operatorName', label: 'Operator name' },
  { key: 'cid', label: 'Player CID' },
  { key: 'bets', label: 'Bets' },
  { key: 'wins', label: 'Wins' },
  { key: 'netCash', label: 'Netgaming' },
  { key: 'createdDate', label: 'Created' },
  { key: 'lastSessionDate', label: 'Last Session' },
];

export const PlayersTable: React.FC<IPlayersTableProps> = ({
  isLoading,
  total,
  offset,
  players,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const { handleExpand, handleResetExpand, isExpanded } = useExpand<string>();

  const handleSetDialogAction = useCallback((id: string, action: PlayerAction) => {
    dispatch(setPlayersDialogAction({
      id,
      action,
      isOpen: true,
    }));
  }, []);

  const handleBlock = useCallback((id: string) => {
    handleSetDialogAction(id, PlayerAction.block);
  }, []);

  const handleUnblock = useCallback((id: string) => {
    handleSetDialogAction(id, PlayerAction.unblock);
  }, []);

  const handleOpenSettingsJSON = useCallback((cid: PlayerCID) => {
    const currentPlayer = players.find((player: IPlayer) => player.cid === cid);

    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(currentPlayer?.settings),
    }));
  }, [players]);

  const handleOpenHistory = useCallback((id) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.players,
    }));
  }, []);

  useEffect(() => {
    handleResetExpand();
  }, [players]);

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
            players.map((player, i) => {
              const {
                cid, currency, status, operatorName, bets, wins, netCash, createdDate, lastSessionDate,
              } = player;

              return (
                <TableRow
                  key={cid}
                  isExpand={isExpanded(cid)}
                  expandComponent={(
                    <>
                      <TableCell colSpan={2} />
                      <TableCell className="groups-table__details-cell" colSpan={9}>
                        <PlayerDetails
                          {...player}
                          onBlock={handleBlock}
                          onUnblock={handleUnblock}
                          onOpenSettingsJSON={handleOpenSettingsJSON}
                          onOpenHistory={handleOpenHistory}
                        />
                      </TableCell>
                    </>
                  )}
                  onExpand={() => handleExpand(cid)}
                >
                  <TableCell>{offset + i + 1}</TableCell>
                  <TableCell>
                    <ExpandBtn isActive={isExpanded(cid)} />
                  </TableCell>
                  <TableCell>
                    <PlayersStatus status={status} />
                  </TableCell>
                  <TableCell>{operatorName}</TableCell>
                  <TableCell>{cid}</TableCell>
                  <TableCell>{formatCurrency(bets, currency)}</TableCell>
                  <TableCell>{formatCurrency(wins, currency)}</TableCell>
                  <TableCell>{formatCurrency(netCash, currency)}</TableCell>
                  <TableCell>{getDateTimeFormatted(createdDate)}</TableCell>
                  <TableCell>{getDateTimeFormatted(lastSessionDate)}</TableCell>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
      <PlayerDialogAction />
      <HistoryDialog />
    </>
  );
};
