import React, { lazy } from 'react';
import { NoMatch } from 'arcadia-common-fe';
import { Redirect, Route, Switch as ReactRouterSwitch } from 'react-router-dom';
import { NO_MATCH_ROUTE, ROUTES_MAP } from './constants';
import { isAuthenticated } from '../services/auth';
import { withPermissions } from '../hocs/withPermissions';

const Dashboard = lazy(() => import('../modules/dashboard/components/Dashboard'));
const SignIn = lazy(() => import('../modules/auth/components/SignIn/SignIn'));

const PrivateRoute = withPermissions(isAuthenticated, () => <Redirect to={ROUTES_MAP.signIn.path} />)(Route);

const ROUTES = [
  { ...ROUTES_MAP.noMatch, RouteComponent: Route, component: NoMatch },
  { ...ROUTES_MAP.signIn, RouteComponent: Route, component: SignIn },
  { ...ROUTES_MAP.dashboard, RouteComponent: PrivateRoute, component: Dashboard },
];

export const Switch = () => (
  <ReactRouterSwitch>
    { ROUTES.map(({
      path, exact, component, RouteComponent, ...restProps
    }) => (
      <RouteComponent
        key={path}
        path={path}
        exact={exact}
        component={component}
        {...restProps}
      />
    )) }
    <Redirect to={NO_MATCH_ROUTE.path} />
  </ReactRouterSwitch>
);
