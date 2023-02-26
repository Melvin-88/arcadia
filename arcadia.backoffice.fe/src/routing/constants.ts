import queryString from 'query-string';
import { IGetVouchersRequestFiltersParams } from 'arcadia-common-fe';
import { IGetMachinesRequestFiltersParams } from '../modules/machines/types';
import { IGetSessionsRequestFiltersParams } from '../modules/sessions/types';
import { IGetGroupsRequestFiltersParams } from '../modules/groups/types';
import { IGetPlayersRequestFilterParams } from '../modules/players/types';
import { IGetOperatorsRequestFilterParams } from '../modules/operators/types';
import { IGetAdministrationRequestFiltersParams } from '../modules/administration/types';
import { IGetAlertsRequestFiltersParams } from '../modules/alerts/types';
import { UserPermissions } from '../modules/auth/types';
import { IGetDisputesRequestFiltersParams } from '../modules/disputes/types';
import { IGetMonitoringRequestFilterParams } from '../modules/monitoring/types';
import { IReportsFiltersPanelValues, ReportType } from '../modules/reports/types';

export interface IRoutesMap {
  path: string
  exact?: boolean
  isWithoutHeader?: boolean
  title: string
  permissionId?: UserPermissions
}

export const ROUTES_MAP = {
  noMatch: {
    path: '/no-match', exact: true, title: '404 - No Match', isWithoutHeader: true,
  },
  signIn: {
    path: '/auth', exact: true, title: 'Sign In', isWithoutHeader: true,
  },
  dashboard: {
    path: '/dashboard', exact: true, title: 'Dashboards', permissionId: UserPermissions.dashboard,
  },
  sessions: {
    path: '/sessions',
    exact: true,
    title: 'Sessions',
    createURL: (queryParams: IGetSessionsRequestFiltersParams) => (
      `${ROUTES_MAP.sessions.path}?${queryString.stringify(queryParams)}`
    ),
    permissionId: UserPermissions.sessions,
  },
  players: {
    path: '/players',
    exact: true,
    title: 'Players',
    createURL: (queryParams: IGetPlayersRequestFilterParams) => (
      `${ROUTES_MAP.players.path}?${queryString.stringify(queryParams)}`
    ),
    permissionId: UserPermissions.players,
  },
  machines: {
    path: '/machines',
    exact: true,
    title: 'Machines',
    createURL: (queryParams: IGetMachinesRequestFiltersParams) => (
      `${ROUTES_MAP.machines.path}?${queryString.stringify(queryParams)}`
    ),
    permissionId: UserPermissions.machines,
  },
  groups: {
    path: '/groups',
    exact: true,
    title: 'Groups',
    createURL: (queryParams: IGetGroupsRequestFiltersParams) => (
      `${ROUTES_MAP.groups.path}?${queryString.stringify(queryParams)}`
    ),
    permissionId: UserPermissions.groups,
  },
  cameras: {
    path: '/cameras',
    exact: true,
    title: 'Cameras',
    permissionId: UserPermissions.cameras,
  },
  vouchers: {
    path: '/vouchers',
    exact: true,
    title: 'Vouchers',
    createURL: (queryParams: IGetVouchersRequestFiltersParams) => (
      `${ROUTES_MAP.vouchers.path}?${queryString.stringify(queryParams)}`
    ),
    permissionId: UserPermissions.vouchers,
  },
  maintenance: {
    path: '/maintenance', exact: true, title: 'Maintenance', permissionId: UserPermissions.maintenance,
  },
  operators: {
    path: '/operators',
    exact: true,
    title: 'Operators',
    createURL: (queryParams: IGetOperatorsRequestFilterParams) => (
      `${ROUTES_MAP.operators.path}?${queryString.stringify(queryParams)}`
    ),
    permissionId: UserPermissions.operators,
  },
  reports: {
    path: '/reports',
    exact: false,
    title: 'Reports',
    permissionId: UserPermissions.reports,
    createReportURL: (reportType: ReportType, queryParams?: IReportsFiltersPanelValues) => (
      `${ROUTES_MAP.reports.path}/${reportType}${queryParams ? `?${queryString.stringify(queryParams)}` : ''}`
    ),
  },
  alerts: {
    path: '/alerts',
    exact: true,
    title: 'Alerts',
    createURL: (queryParams: IGetAlertsRequestFiltersParams) => (
      `${ROUTES_MAP.alerts.path}?${queryString.stringify(queryParams)}`
    ),
    permissionId: UserPermissions.alerts,
  },
  disputes: {
    path: '/disputes',
    exact: true,
    title: 'Disputes',
    createURL: (queryParams: IGetDisputesRequestFiltersParams) => (
      `${ROUTES_MAP.disputes.path}?${queryString.stringify(queryParams)}`
    ),
    permissionId: UserPermissions.disputes,
  },
  monitoring: {
    path: '/monitoring',
    exact: true,
    title: 'Monitoring',
    createURL: (queryParams: IGetMonitoringRequestFilterParams) => (
      `${ROUTES_MAP.monitoring.path}?${queryString.stringify(queryParams)}`
    ),
    permissionId: UserPermissions.monitoring,
  },
  administration: {
    path: '/administration',
    exact: true,
    title: 'Administration',
    createURL: (queryParams: IGetAdministrationRequestFiltersParams) => (
      `${ROUTES_MAP.administration.path}?${queryString.stringify(queryParams)}`
    ),
    permissionId: UserPermissions.administration,
  },
};

export const DEFAULT_ROUTE = ROUTES_MAP.dashboard;
export const NO_MATCH_ROUTE = ROUTES_MAP.noMatch;
