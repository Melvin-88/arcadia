import React, { lazy } from 'react';
import {
  Switch as ReactRouterSwitch, Route, Redirect,
} from 'react-router-dom';
import { DEFAULT_ROUTE, ROUTES_MAP } from './constants';
import { IRoutes } from './types';
import { Auth } from '../modules/auth/components/Auth';

const ROUTES: IRoutes = [
  { ...ROUTES_MAP.auth, component: Auth },
  { ...ROUTES_MAP.game, component: lazy(() => import('../modules/game/components/Game')) },
  { ...ROUTES_MAP.lobby, component: lazy(() => import('../modules/lobby/components/Lobby')) },
  { ...ROUTES_MAP.exit, component: lazy(() => import('../components/Exit/Exit')) },
];

export const Switch = () => (
  <ReactRouterSwitch>
    { ROUTES.map((route) => (
      <Route
        key={route.path}
        {...route}
      />
    )) }
    <Redirect to={DEFAULT_ROUTE.path} />
  </ReactRouterSwitch>
);
