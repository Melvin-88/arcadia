import { combineReducers } from 'redux';
import { authReducer } from '../modules/auth/state/reducer';
import { selectEntityByTypeReducer } from '../modules/selectEntityByType/reducer';
import { dashboardReducer } from '../modules/dashboard/state/reducer';

export const rootReducer = combineReducers({
  authReducer,
  selectEntityByTypeReducer,
  dashboardReducer,
});
