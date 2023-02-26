import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'arcadia-common-fe';
import classnames from 'classnames';
import { getPlayersPerDay } from '../../state/actions';
import { dashboardPlayersPerDaySelector } from '../../state/selectors';
import ArrowIcon from '../../../../assets/svg/arrow.svg';
import { ACTIVE_PLAYERS_UPDATE_INTERVAL } from '../../constants';
import './PlayersPerDay.scss';

export const PlayersPerDay = () => {
  const dispatch = useDispatch();
  const {
    isLoading, countActive, countActivePrevious, countNew, countNewPrevious,
  } = useSelector(dashboardPlayersPerDaySelector);

  const activePlayersPercent = useMemo(() => {
    if (countActive && countActivePrevious) {
      return ((countActive / countActivePrevious) * 100 - 100).toFixed(0);
    }

    return 0;
  }, [countActive, countActivePrevious]);

  const newPlayersPercent = useMemo(() => {
    if (countNew && countNewPrevious) {
      return ((countNew / countNewPrevious) * 100 - 100).toFixed(0);
    }

    return 0;
  }, [countNew, countNewPrevious]);

  const handleGetPlayersPerDay = useCallback(() => {
    dispatch(getPlayersPerDay());
  }, []);

  useEffect(() => {
    handleGetPlayersPerDay();

    const interval = setInterval(() => {
      handleGetPlayersPerDay();
    }, ACTIVE_PLAYERS_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetPlayersPerDay]);

  return (
    <div className="players-per-day">
      {
        isLoading ? (
          <Spinner className="players-per-day__spinner" />
        ) : (
          <Table
            isLoading={isLoading}
            count={2}
          >
            <TableHead>
              <TableRow>
                <TableCell>Active players (24h)</TableCell>
                <TableCell>New players (24h)</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>
                  {countActive}
                  &nbsp;
                  (
                  {countActivePrevious}
                  &nbsp;
                  <ArrowIcon
                    className={classnames(
                      'players-per-day__icon',
                      { 'players-per-day__icon--negative': String(activePlayersPercent).indexOf('-') !== -1 },
                    )}
                  />
                  &nbsp;
                  {activePlayersPercent}
                  %)
                </TableCell>
                <TableCell>
                  {countNew}
                  &nbsp;
                  (
                  {countNewPrevious}
                  &nbsp;
                  <ArrowIcon
                    className={classnames(
                      'players-per-day__icon',
                      { 'players-per-day__icon--negative': String(newPlayersPercent).indexOf('-') !== -1 },
                    )}
                  />
                  &nbsp;
                  {newPlayersPercent}
                  %)
                </TableCell>
              </TableRow>
              <TableRow />
            </TableBody>
          </Table>
        )
      }
    </div>
  );
};
