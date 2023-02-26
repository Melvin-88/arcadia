export const ROUTES_MAP = {
  noMatch: {
    path: '/no-match', exact: true, title: '404 - No Match',
  },
  signIn: {
    path: '/auth', exact: true, title: 'Sign In',
  },
  dashboard: {
    path: '/', exact: true, title: 'Dashboard',
  },
};

export const DEFAULT_ROUTE = ROUTES_MAP.dashboard;
export const NO_MATCH_ROUTE = ROUTES_MAP.noMatch;
