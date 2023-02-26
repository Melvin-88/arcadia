import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  covertBooleanToYesNo,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
} from 'arcadia-common-fe';
import classNames from 'classnames';
import { topWinnersAndLosersSelector } from '../../state/selectors';
import { getTopWinnersAndLosers } from '../../state/actions';
import { TOP_WINNERS_AND_LOSERS_UPDATE_INTERVAL } from '../../constants';
import { ROUTES_MAP } from '../../../../routing/constants';
import './TopWinnersAndLosers.scss';

interface ITopWinnersAndLosersProps {
  className?: string
}

export const TopWinnersAndLosers: React.FC<ITopWinnersAndLosersProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { isLoading, winners, losers } = useSelector(topWinnersAndLosersSelector);

  const handleGetTopWinnersAndLosers = useCallback(() => {
    dispatch(getTopWinnersAndLosers());
  }, []);

  useEffect(() => {
    handleGetTopWinnersAndLosers();

    const interval = setInterval(() => {
      handleGetTopWinnersAndLosers();
    }, TOP_WINNERS_AND_LOSERS_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetTopWinnersAndLosers]);

  return (
    <div className={classNames('top-winners-and-losers', className)}>
      {
        isLoading ? (
          <Spinner className="top-winners-and-losers__spinner" />
        ) : (
          <>
            <div className="top-winners-and-losers__chart-title">Top winners and losers in 24h</div>
            <div className="top-winners-and-losers__tables">
              <Table isLoading={isLoading}>
                <TableHead>
                  <TableRow>
                    <TableCell>Player</TableCell>
                    <TableCell>Win</TableCell>
                    <TableCell>Online</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {
                    winners.map(({
                      player, playerCid, win, online,
                    }) => (
                      <TableRow key={player + win + online}>
                        <TableCell>
                          <Link to={ROUTES_MAP.players.createURL({ cid: playerCid })}>{player}</Link>
                        </TableCell>
                        <TableCell>{win}</TableCell>
                        <TableCell>{covertBooleanToYesNo(online)}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>

              <Table isLoading={isLoading}>
                <TableHead>
                  <TableRow>
                    <TableCell>Player</TableCell>
                    <TableCell>Loss</TableCell>
                    <TableCell>Online</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {
                    losers.map(({
                      player, playerCid, loss, online,
                    }) => (
                      <TableRow key={player + loss + online}>
                        <TableCell>
                          <Link to={ROUTES_MAP.players.createURL({ cid: playerCid })}>{player}</Link>
                        </TableCell>
                        <TableCell>{loss}</TableCell>
                        <TableCell>{covertBooleanToYesNo(online)}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          </>
        )
      }
    </div>
  );
};
