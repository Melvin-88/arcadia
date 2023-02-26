import { IRoutesMap } from './types';

export const ROUTES_MAP: IRoutesMap = {
  auth: { path: '/launchGame', exact: true },
  game: {
    path: '/',
    exact: true,
  },
  lobby: { path: '/lobby', exact: true },
  exit: { path: '/exit', exact: true },
  notFound: { path: '/404', exact: true },
};

export const DEFAULT_ROUTE = ROUTES_MAP.notFound;
