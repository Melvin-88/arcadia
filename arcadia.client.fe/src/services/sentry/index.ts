import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { DEFAULT_IGNORE_ERRORS_PATTERNS, DEFAULT_IGNORE_URLS_PATTERNS, DSN } from './constants';
import { store } from '../../store/store';

Sentry.init({
  dsn: DSN,
  release: process.env.RELEASE_ID,
  enabled: process.env.NODE_ENV !== 'development',
  blacklistUrls: DEFAULT_IGNORE_URLS_PATTERNS,
  ignoreErrors: DEFAULT_IGNORE_ERRORS_PATTERNS,
  environment: process.env.NODE_ENV,
  integrations: [
    new Integrations.BrowserTracing(),
    new Sentry.Integrations.TryCatch(),
  ],
  beforeSend(event) {
    const { session } = store.getState().appReducer || {};
    const { playerId, sessionId } = session;

    // eslint-disable-next-line no-param-reassign
    event.user = {
      id: playerId,
      sessionId,
    };

    return event;
  },
});
