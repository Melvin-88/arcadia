import { call } from 'redux-saga/effects';
import { toast } from 'react-toastify';

export function* handleError(error: Error, defaultErrorMessage = 'Oops! Something went wrong. Please try again later.') {
  // eslint-disable-next-line no-console
  yield call(console.error, error);
  yield call(toast.error, error.message || defaultErrorMessage);
}
