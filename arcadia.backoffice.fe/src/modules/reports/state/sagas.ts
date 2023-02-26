import { all } from 'redux-saga/effects';
import { processedReportsSagas } from '../modules/processedReports/state/saga';
import { activityReportSagas } from '../modules/activity/state/saga';
import { playerStatsReportSagas } from '../modules/playerStats/state/saga';
import { disputesReportSagas } from '../modules/disputes/state/saga';
import { vouchersReportSagas } from '../modules/vouchers/state/saga';
import { playerBlocksReportSagas } from '../modules/playerBlocks/state/saga';
import { machineStatusReportSagas } from '../modules/machineStatus/state/saga';
import { retentionReportSagas } from '../modules/retention/state/saga';
import { funnelReportSagas } from '../modules/funnel/state/saga';
import { revenueReportSagas } from '../modules/revenue/state/saga';

export function* reportsSagas() {
  yield all([
    processedReportsSagas(),
    activityReportSagas(),
    playerStatsReportSagas(),
    disputesReportSagas(),
    vouchersReportSagas(),
    playerBlocksReportSagas(),
    machineStatusReportSagas(),
    retentionReportSagas(),
    funnelReportSagas(),
    revenueReportSagas(),
  ]);
}
