import axios from 'axios';
import { store } from '../../store/store';
import { logOut } from '../../modules/auth/state/actions';
import { isAuthenticated } from '../auth';
import { APIErrorMessage } from './constants';

axios.interceptors.response.use((response) => response, (error) => {
  const { response } = error;

  if (response) {
    const { status, data: responseData } = response;
    const { data } = responseData;
    const { message } = data;

    if (status === 401 && isAuthenticated() && message !== APIErrorMessage.wrongPassword) {
      store.dispatch(logOut());
    }
  }

  return Promise.reject(error);
});
