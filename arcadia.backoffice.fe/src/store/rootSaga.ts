import { all } from 'redux-saga/effects';
import { authSagas } from '../modules/auth/saga';
import { selectEntityByTypeSagas } from '../modules/selectEntityByType/saga';
import { historySagas } from '../modules/history/state/saga';
import { dashboardSagas } from '../modules/dashboard/state/saga';
import { sessionsSagas } from '../modules/sessions/saga';
import { playersSagas } from '../modules/players/state/saga';
import { groupsSagas } from '../modules/groups/state/saga';
import { machinesSagas } from '../modules/machines/state/saga';
import { vouchersSagas } from '../modules/vouchers/state/saga';
import { camerasSagas } from '../modules/cameras/state/saga';
import { maintenanceSagas } from '../modules/maintenance/state/saga';
import { operatorsSagas } from '../modules/operators/state/saga';
import { reportsSagas } from '../modules/reports/state/sagas';
import { alertsSagas } from '../modules/alerts/state/saga';
import { disputesSagas } from '../modules/disputes/state/saga';
import { monitoringSagas } from '../modules/monitoring/state/saga';
import { administrationSagas } from '../modules/administration/state/saga';

export function* rootSaga() {
  yield all([
    authSagas(),
    selectEntityByTypeSagas(),
    historySagas(),
    dashboardSagas(),
    sessionsSagas(),
    playersSagas(),
    groupsSagas(),
    machinesSagas(),
    vouchersSagas(),
    camerasSagas(),
    maintenanceSagas(),
    operatorsSagas(),
    reportsSagas(),
    alertsSagas(),
    disputesSagas(),
    monitoringSagas(),
    administrationSagas(),
  ]);
}
