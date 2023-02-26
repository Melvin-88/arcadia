import { store } from '../store/store';
import { isAuthenticatedSelector } from '../modules/auth/state/selectors';

export const isAuthenticated = () => isAuthenticatedSelector(store.getState());
