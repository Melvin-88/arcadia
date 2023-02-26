import { Action } from 'redux';
import { combinedReducer } from './combinedReducer';
import { resetState } from './actions';

export const rootReducer = (state: any, action: Action) => {
  if (action.type === resetState.type) {
    // eslint-disable-next-line
    state = undefined;
  }

  return combinedReducer(state, action);
};
