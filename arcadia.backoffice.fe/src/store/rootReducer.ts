import { combineReducers } from 'redux';
import { authReducer } from '../modules/auth/reducer';
import { selectEntityByTypeReducer } from '../modules/selectEntityByType/reducer';
import { historyReducer } from '../modules/history/state/reducer';
import { dialogJSONViewerReducer } from '../modules/DialogJSONViewer/reducer';
import { dashboardReducer } from '../modules/dashboard/state/reducer';
import { sessionsReducer } from '../modules/sessions/reducer';
import { playersReducer } from '../modules/players/state/reducer';
import { groupsReducer } from '../modules/groups/state/reducer';
import { machinesReducer } from '../modules/machines/state/reducer';
import { vouchersReducer } from '../modules/vouchers/state/reducer';
import { camerasReducer } from '../modules/cameras/state/reducer';
import { maintenanceReducer } from '../modules/maintenance/state/reducer';
import { operatorsReducer } from '../modules/operators/state/reducer';
import { rootReportsReducer } from '../modules/reports/state/rootReportsReducer';
import { alertsReducer } from '../modules/alerts/state/reducer';
import { disputesReducer } from '../modules/disputes/state/reducer';
import { monitoringReducer } from '../modules/monitoring/state/reducer';
import { administrationReducer } from '../modules/administration/state/reducer';

export const rootReducer = combineReducers({
  authReducer,
  selectEntityByTypeReducer,
  historyReducer,
  dialogJSONViewerReducer,
  dashboardReducer,
  sessionsReducer,
  playersReducer,
  groupsReducer,
  machinesReducer,
  vouchersReducer,
  camerasReducer,
  maintenanceReducer,
  operatorsReducer,
  rootReportsReducer,
  alertsReducer,
  disputesReducer,
  monitoringReducer,
  administrationReducer,
});
