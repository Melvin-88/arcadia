import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDateTimeFormatted } from 'arcadia-common-fe';
import classNames from 'classnames';
import { LineChart } from '../LineChart/LineChart';
import { getActiveAndNewPlayers } from '../../state/actions';
import { activeAndNewPlayersSelector } from '../../state/selectors';
import { ILineChartItems } from '../LineChart/type';
import { dataKeys } from './constants';
import { ACTIVE_AND_NEW_PLAYERS_UPDATE_INTERVAL, DASHBOARD_DATE_FORMAT } from '../../constants';
import './ActiveAndNewPlayers.scss';

interface IActiveAndNewPlayersProps {
  className?: string
}

export const ActiveAndNewPlayers: React.FC<IActiveAndNewPlayersProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { isLoading, stats } = useSelector(activeAndNewPlayersSelector);

  const data: ILineChartItems = useMemo(() => (
    stats.map(({ date, countActive, countNew }) => ({
      name: getDateTimeFormatted(date, DASHBOARD_DATE_FORMAT),
      Active: countActive,
      New: countNew,
    }))
  ), [stats]);

  const handleGetActiveAndNewPlayers = useCallback(() => {
    dispatch(getActiveAndNewPlayers());
  }, []);

  useEffect(() => {
    handleGetActiveAndNewPlayers();

    const interval = setInterval(() => {
      handleGetActiveAndNewPlayers();
    }, ACTIVE_AND_NEW_PLAYERS_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetActiveAndNewPlayers]);

  return (
    <LineChart
      className={classNames('active-and-new-players', className)}
      classNameChart="active-and-new-players__chart"
      title="30 days Active and new players"
      data={data}
      isLoading={isLoading}
      dataKeys={dataKeys}
    />
  );
};
