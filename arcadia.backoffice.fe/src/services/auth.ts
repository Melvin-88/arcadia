import { store } from '../store/store';
import { isAuthenticatedSelector } from '../modules/auth/selectors';

export const isAuthenticated = () => isAuthenticatedSelector(store.getState());
