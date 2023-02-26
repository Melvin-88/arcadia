import { combineReducers } from 'redux';
import { reportsReducer } from './reportsReducer';
import { processedReportsReducer } from '../modules/processedReports/state/reducer';
import { activityReportReducer } from '../modules/activity/state/reducer';
import { playerStatsReportReducer } from '../modules/playerStats/state/reducer';
import { vouchersReportReducer } from '../modules/vouchers/state/reducer';
import { disputesReportReducer } from '../modules/disputes/state/reducer';
import { playerBlocksReportReducer } from '../modules/playerBlocks/state/reducer';
import { machineStatusReportReducer } from '../modules/machineStatus/state/reducer';
import { retentionReportReducer } from '../modules/retention/state/reducer';
import { funnelReportReducer } from '../modules/funnel/state/reducer';
import { revenueReportReducer } from '../modules/revenue/state/reducer';

export const rootReportsReducer = combineReducers({
  reportsReducer,
  processedReportsReducer,
  activityReportReducer,
  playerStatsReportReducer,
  vouchersReportReducer,
  disputesReportReducer,
  playerBlocksReportReducer,
  machineStatusReportReducer,
  retentionReportReducer,
  funnelReportReducer,
  revenueReportReducer,
});
