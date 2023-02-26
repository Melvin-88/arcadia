import axios from 'axios';
import { store } from '../../store/store';
import { logOut } from '../../modules/auth/actions';
import { isAuthenticated } from '../auth';
import { APIErrorMessage } from './constants';

axios.interceptors.response.use((response) => response, async (error) => {
  const { response } = error;

  if (response) {
    const { status, data: responseData } = response;

    if (error.config.responseType === 'blob') {
      try {
        const errorString = await responseData.text();
        const errorBody = JSON.parse(errorString);

        // eslint-disable-next-line no-param-reassign
        error.response.data = errorBody;
        responseData.data = errorBody;
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error(parseError);
      }
    }

    const { data } = responseData;
    const { message } = data;

    if (status === 401 && isAuthenticated() && message !== APIErrorMessage.wrongPassword) {
      store.dispatch(logOut());
    }
  }

  return Promise.reject(error);
});
