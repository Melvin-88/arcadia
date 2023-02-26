import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserControls } from 'arcadia-common-fe';
import { getStatistics } from '../../state/actions';
import { dashboardStatisticsSelector } from '../../state/selectors';
import { logOut } from '../../../auth/state/actions';
import { operatorSelector } from '../../../auth/state/selectors';
import './VouchersHeader.scss';

interface IVouchersHeaderProps {
}

export const VouchersHeader: React.FC<IVouchersHeaderProps> = () => {
  const dispatch = useDispatch();
  const {
    inPending, usedInLast24Hours, usedInLast7Days, usedInLast30Days,
  } = useSelector(dashboardStatisticsSelector);
  const operator = useSelector(operatorSelector);

  const handleLogOut = useCallback(() => {
    dispatch(logOut());
  }, []);

  useEffect(() => {
    dispatch(getStatistics());
  }, []);

  return (
    <div className="vouchers-header">
      <div className="vouchers-header__statistics">
        <div>
          <span className="vouchers-header__statistics-title">Statistics</span>
          Number of vouchers:
        </div>
        <UserControls
          name={operator?.name}
          onLogOut={handleLogOut}
        />
      </div>
      <div className="vouchers-header__statistics-groups">
        <div>
          In status Pending:
          <span className="vouchers-header__statistics-value">{inPending}</span>
        </div>
        <div>
          Used in last 24h:
          <span className="vouchers-header__statistics-value">{usedInLast24Hours}</span>
        </div>
        <div>
          Used in last 7d:
          <span className="vouchers-header__statistics-value">{usedInLast7Days}</span>
        </div>
        <div>
          Used in last 30d:
          <span className="vouchers-header__statistics-value">{usedInLast30Days}</span>
        </div>
      </div>
    </div>
  );
};
