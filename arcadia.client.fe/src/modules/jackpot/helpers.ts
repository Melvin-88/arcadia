import { SessionStorageKeys } from '../../constants';
import { loginPlayerRequest } from './api';

export const loginAnonymousPlayer = async () => {
  const token = sessionStorage.getItem(SessionStorageKeys.blueRibbonAccessToken) as string;
  const responseData = await loginPlayerRequest({ token });

  return responseData.data;
};

export const loginAuthenticatedPlayer = async () => {
  const token = sessionStorage.getItem(SessionStorageKeys.blueRibbonAccessToken) as string;
  const responseData = await loginPlayerRequest({ token });

  return responseData.data;
};
