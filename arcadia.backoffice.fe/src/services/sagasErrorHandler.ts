import { call } from 'redux-saga/effects';
import { toast } from 'react-toastify';

interface IError extends Error {
  response?: {
    data: {
      data: string[]
    }
  }
}

function getMessageFromError(error: IError) {
  if (error?.response?.data?.data?.length) {
    return error.response.data.data.join(', ');
  }

  if (error.message) {
    return error.message;
  }

  return null;
}

export function* handleError(error: IError, defaultErrorMessage = 'Oops! Something went wrong. Please try again later.') {
  const message = getMessageFromError(error);

  yield call(toast.error, message || defaultErrorMessage);
}
