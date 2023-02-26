import { SortOrder, VoucherStatus } from 'arcadia-common-fe';
import { SessionStatus } from '../modules/sessions/types';
import { PlayerStatus } from '../modules/players/types';
import { AlertStatus } from '../modules/alerts/types';

export const { API_HOST } = process.env;

export enum LocalStorageKeys {
  accessToken = 'accessToken',
  user = 'user',
}

export const ALERTS_UPDATE_INTERVAL = 30000;

export const SESSIONS_UPDATE_INTERVAL = 30000;

export const MACHINES_UPDATE_INTERVAL = 30000;

export const modulesInitialFilters = {
  sessions: {
    status: [SessionStatus.playing, SessionStatus.terminating, SessionStatus.queue, SessionStatus.viewer],
    sortBy: 'status',
    sortOrder: SortOrder.desc,
  },
  players: {
    status: [PlayerStatus.inPlay, PlayerStatus.active],
    sortBy: 'status',
    sortOrder: SortOrder.asc,
  },
  groups: {
    sortBy: 'name',
    sortOrder: SortOrder.asc,
  },
  machines: {
    sortBy: 'status',
    sortOrder: SortOrder.asc,
  },
  vouchers: {
    status: [VoucherStatus.pending],
    sortBy: 'grantedDate',
    sortOrder: SortOrder.desc,
  },
  operators: {
    sortBy: 'name',
    sortOrder: SortOrder.asc,
  },
  cameras: {
    sortBy: 'id',
    sortOrder: SortOrder.asc,
  },
  alerts: {
    status: [AlertStatus.active],
  },
  disputes: {
    sortBy: 'status',
    sortOrder: SortOrder.asc,
  },
  monitoring: {
    sortBy: 'status',
    sortOrder: SortOrder.asc,
  },
  administration: {
    sortBy: 'status',
    sortOrder: SortOrder.asc,
  },
};
