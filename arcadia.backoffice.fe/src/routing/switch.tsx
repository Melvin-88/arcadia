import React, { lazy } from 'react';
import { Redirect, Route, Switch as ReactRouterSwitch } from 'react-router-dom';
import { NoMatch } from 'arcadia-common-fe';
import { NO_MATCH_ROUTE, ROUTES_MAP } from './constants';
import { isAuthenticated } from '../services/auth';
import { withPermissions } from '../hocs/withPermissions';
import { pushToDefaultRoute } from '../hocs/pushToDefaultRoute';

const SignIn = lazy(() => import('../modules/auth/components/SignIn/SignIn'));
const Dashboard = lazy(() => import('../modules/dashboard/components/Dashboard'));
const Sessions = lazy(() => import('../modules/sessions/components/Sessions'));
const Players = lazy(() => import('../modules/players/components/Players'));
const Groups = lazy(() => import('../modules/groups/components/Groups'));
const Machines = lazy(() => import('../modules/machines/components/Machines'));
const Vouchers = lazy(() => import('../modules/vouchers/components/Vouchers'));
const Cameras = lazy(() => import('../modules/cameras/components/Cameras'));
const Maintenance = lazy(() => import('../modules/maintenance/components/Maintenance'));
const Operators = lazy(() => import('../modules/operators/components/Operators'));
const Reports = lazy(() => import('../modules/reports/components/Reports'));
const Alerts = lazy(() => import('../modules/alerts/components/Alerts'));
const Disputes = lazy(() => import('../modules/disputes/components/Disputes'));
const Monitoring = lazy(() => import('../modules/monitoring/components/Monitoring'));
const Administration = lazy(() => import('../modules/administration/components/Administration'));

const UserDefaultRoute = pushToDefaultRoute(isAuthenticated, () => <Redirect to={ROUTES_MAP.signIn.path} />)(Route);
const PrivateRoute = withPermissions(isAuthenticated, () => <Redirect to={ROUTES_MAP.signIn.path} />)(Route);

const ROUTES = [
  { ...ROUTES_MAP.noMatch, RouteComponent: Route, component: NoMatch },
  { ...ROUTES_MAP.signIn, RouteComponent: Route, component: SignIn },
  { ...ROUTES_MAP.dashboard, RouteComponent: PrivateRoute, component: Dashboard },
  { ...ROUTES_MAP.sessions, RouteComponent: PrivateRoute, component: Sessions },
  { ...ROUTES_MAP.players, RouteComponent: PrivateRoute, component: Players },
  { ...ROUTES_MAP.groups, RouteComponent: PrivateRoute, component: Groups },
  { ...ROUTES_MAP.machines, RouteComponent: PrivateRoute, component: Machines },
  { ...ROUTES_MAP.cameras, RouteComponent: PrivateRoute, component: Cameras },
  { ...ROUTES_MAP.vouchers, RouteComponent: PrivateRoute, component: Vouchers },
  { ...ROUTES_MAP.maintenance, RouteComponent: PrivateRoute, component: Maintenance },
  { ...ROUTES_MAP.operators, RouteComponent: PrivateRoute, component: Operators },
  { ...ROUTES_MAP.reports, RouteComponent: PrivateRoute, component: Reports },
  { ...ROUTES_MAP.alerts, RouteComponent: PrivateRoute, component: Alerts },
  { ...ROUTES_MAP.disputes, RouteComponent: PrivateRoute, component: Disputes },
  { ...ROUTES_MAP.monitoring, RouteComponent: PrivateRoute, component: Monitoring },
  { ...ROUTES_MAP.administration, RouteComponent: PrivateRoute, component: Administration },
];

export const Switch = () => (
  <ReactRouterSwitch>
    <UserDefaultRoute exact path="/" />
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
