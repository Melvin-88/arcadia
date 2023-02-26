import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveSessionsBreakdown } from '../../state/actions';
import { dashboardActiveSessionsBreakdownSelector } from '../../state/selectors';
import { PieChart } from '../PieChart/PieChart';
import { ActiveSessionsBreakdownColor, ActiveSessionsBreakdownLabel, IActiveSessionsBreakdownChartData } from '../../types';
import { ACTIVE_SESSIONS_BREAKDOWN_UPDATE_INTERVAL } from '../../constants';

interface IActiveSessionsBreakdownProps {
  className?: string
}

export const ActiveSessionsBreakdown: React.FC<IActiveSessionsBreakdownProps> = ({ className }) => {
  const dispatch = useDispatch();
  const {
    isLoading, countObserving, countQueuing, countBetBehind, countInPlay, countReBuy,
  } = useSelector(dashboardActiveSessionsBreakdownSelector);

  const handleGetActiveSessionsBreakdown = useCallback(() => {
    dispatch(getActiveSessionsBreakdown());
  }, []);

  useEffect(() => {
    handleGetActiveSessionsBreakdown();

    const interval = setInterval(() => {
      handleGetActiveSessionsBreakdown();
    }, ACTIVE_SESSIONS_BREAKDOWN_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetActiveSessionsBreakdown]);

  const data: IActiveSessionsBreakdownChartData = useMemo(() => ([
    {
      name: ActiveSessionsBreakdownLabel.observing,
      value: countObserving,
      color: ActiveSessionsBreakdownColor.observing,
    },
    {
      name: ActiveSessionsBreakdownLabel.queuing,
      value: countQueuing,
      color: ActiveSessionsBreakdownColor.queuing,
    },
    {
      name: ActiveSessionsBreakdownLabel.betBehind,
      value: countBetBehind,
      color: ActiveSessionsBreakdownColor.betBehind,
    },
    {
      name: ActiveSessionsBreakdownLabel.inPlay,
      value: countInPlay,
      color: ActiveSessionsBreakdownColor.inPlay,
    },
    {
      name: ActiveSessionsBreakdownLabel.reBuy,
      value: countReBuy,
      color: ActiveSessionsBreakdownColor.reBuy,
    },
  ]), [countObserving, countQueuing, countBetBehind, countInPlay, countReBuy]);

  return (
    <PieChart
      className={className}
      title="Active sessions breakdown"
      data={data}
      isLoading={isLoading}
    />
  );
};
