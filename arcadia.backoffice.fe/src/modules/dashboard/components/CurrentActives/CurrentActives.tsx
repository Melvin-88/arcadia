import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentActives } from '../../state/actions';
import { dashboardCurrentActivesSelector } from '../../state/selectors';
import { PieChart } from '../PieChart/PieChart';
import { CurrentActivesColor, CurrentActivesLabel, ICurrentActivesChartData } from '../../types';
import { CURRENT_ACTIVES_UPDATE_INTERVAL } from '../../constants';

interface ICurrentActivesProps {
  className?: string
}

export const CurrentActives: React.FC<ICurrentActivesProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { isLoading, countExisting, countNew } = useSelector(dashboardCurrentActivesSelector);

  const handleGetCurrentActives = useCallback(() => {
    dispatch(getCurrentActives());
  }, []);

  useEffect(() => {
    handleGetCurrentActives();

    const interval = setInterval(() => {
      handleGetCurrentActives();
    }, CURRENT_ACTIVES_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetCurrentActives]);

  const data: ICurrentActivesChartData = useMemo(() => ([
    { name: CurrentActivesLabel.existing, value: countExisting, color: CurrentActivesColor.existing },
    { name: CurrentActivesLabel.new, value: countNew, color: CurrentActivesColor.new },
  ]), [countExisting, countNew]);

  return (
    <PieChart
      className={className}
      title="Current Actives - existing vs new"
      data={data}
      isLoading={isLoading}
    />
  );
};
