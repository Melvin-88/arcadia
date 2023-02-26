import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDateTimeFormatted } from 'arcadia-common-fe';
import { LineChart } from '../LineChart/LineChart';
import { getBettingActivity } from '../../state/actions';
import { bettingActivitySelector } from '../../state/selectors';
import { ILineChartItems } from '../LineChart/type';
import { dataKeys } from './constants';
import { BETTING_ACTIVITY_UPDATE_INTERVAL, DASHBOARD_DATE_FORMAT } from '../../constants';

interface IBettingActivityProps {
  className?: string
}

export const BettingActivity: React.FC<IBettingActivityProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { isLoading, bets } = useSelector(bettingActivitySelector);

  const data: ILineChartItems = useMemo(() => (
    bets.map((bet) => ({
      name: getDateTimeFormatted(bet.date, DASHBOARD_DATE_FORMAT),
      Rounds: bet.rounds,
      Bets: bet.bets,
      Wins: bet.wins,
    }))
  ), [bets]);

  const handleGetBettingActivity = useCallback(() => {
    dispatch(getBettingActivity());
  }, []);

  useEffect(() => {
    handleGetBettingActivity();

    const interval = setInterval(() => {
      handleGetBettingActivity();
    }, BETTING_ACTIVITY_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetBettingActivity]);

  return (
    <LineChart
      className={className}
      title="30 days betting activity"
      data={data}
      isLoading={isLoading}
      dataKeys={dataKeys}
    />
  );
};
