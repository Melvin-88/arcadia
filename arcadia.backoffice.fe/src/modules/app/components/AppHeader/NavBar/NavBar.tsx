import React, { useCallback } from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES_MAP } from '../../../../../routing/constants';
import { modulesInitialFilters } from '../../../../../constants';
import { authReducerSelector } from '../../../../auth/selectors';
import './styles/NavBar.scss';

interface INavBarProps {
  className?: string
}

const items = [
  ROUTES_MAP.dashboard,
  {
    ...ROUTES_MAP.sessions,
    path: ROUTES_MAP.sessions.createURL(modulesInitialFilters.sessions),
  },
  {
    ...ROUTES_MAP.players,
    path: ROUTES_MAP.players.createURL(modulesInitialFilters.players),
  },
  {
    ...ROUTES_MAP.groups,
    path: ROUTES_MAP.groups.createURL(modulesInitialFilters.groups),
  },
  {
    ...ROUTES_MAP.machines,
    path: ROUTES_MAP.machines.createURL(modulesInitialFilters.machines),
  },
  ROUTES_MAP.cameras,
  {
    ...ROUTES_MAP.vouchers,
    path: ROUTES_MAP.vouchers.createURL(modulesInitialFilters.vouchers),
  },
  ROUTES_MAP.maintenance,
  {
    ...ROUTES_MAP.operators,
    path: ROUTES_MAP.operators.createURL(modulesInitialFilters.operators),
  },
  ROUTES_MAP.reports,
  {
    ...ROUTES_MAP.alerts,
    path: ROUTES_MAP.alerts.createURL(modulesInitialFilters.alerts),
  },
  {
    ...ROUTES_MAP.disputes,
    path: ROUTES_MAP.disputes.createURL(modulesInitialFilters.disputes),
  },
  {
    ...ROUTES_MAP.monitoring,
    path: ROUTES_MAP.monitoring.createURL(modulesInitialFilters.monitoring),
  },
  {
    ...ROUTES_MAP.administration,
    path: ROUTES_MAP.administration.createURL(modulesInitialFilters.administration),
  },
];

export const NavBar: React.FC<INavBarProps> = ({ className }) => {
  const { userPermissions } = useSelector(authReducerSelector);

  const isNotAllowedToShow = useCallback((permissionId) => (
    !userPermissions?.some((permission) => permission === permissionId)
  ), [userPermissions]);

  return (
    <div className={classNames('nav-bar', className)}>
      {
        items.map(({
          path, title, exact, permissionId,
        }) => {
          if (isNotAllowedToShow(permissionId)) {
            return null;
          }

          return (
            <NavLink
              key={path + title}
              className="nav-bar__item"
              activeClassName="nav-bar__item--active"
              exact={exact}
              to={path}
            >
              <div className="nav-bar__item-content">
                {title}
              </div>
            </NavLink>
          );
        })
      }
    </div>
  );
};
