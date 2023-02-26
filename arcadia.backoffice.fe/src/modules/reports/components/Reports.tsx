import React from 'react';
import {
  Redirect, Route, Switch, RouteComponentProps,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES_MAP } from '../../../routing/constants';
import { ReportsCommandBar } from './ReportsCommandBar/ReportsCommandBar';
import { Activity } from '../modules/activity/components/Activity';
import { ReportType } from '../types';
import { ProcessedReportsDialog } from '../modules/processedReports/components/ProcessedReportsDialog';
import { reportsReducerSelector } from '../state/selectors';
import { PlayerStats } from '../modules/playerStats/components/PlayerStats';
import { Vouchers } from '../modules/vouchers/components/Vouchers';
import { Disputes } from '../modules/disputes/components/Disputes';
import { PlayerBlocks } from '../modules/playerBlocks/components/PlayerBlocks';
import { MachineStatus } from '../modules/machineStatus/components/MachineStatus';
import { Retention } from '../modules/retention/components/Retention';
import { Funnel } from '../modules/funnel/components/Funnel';
import { Revenue } from '../modules/revenue/components/Revenue';

interface IRoute {
  path: string
  exact: boolean
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
}

export const reportsRoutesMap: { [key in ReportType]: IRoute } = {
  [ReportType.activity]: {
    path: `${ROUTES_MAP.reports.path}/${ReportType.activity}`, exact: true, component: Activity,
  },
  [ReportType.playerStats]: {
    path: `${ROUTES_MAP.reports.path}/${ReportType.playerStats}`, exact: true, component: PlayerStats,
  },
  [ReportType.vouchers]: {
    path: `${ROUTES_MAP.reports.path}/${ReportType.vouchers}`, exact: true, component: Vouchers,
  },
  [ReportType.disputes]: {
    path: `${ROUTES_MAP.reports.path}/${ReportType.disputes}`, exact: true, component: Disputes,
  },
  [ReportType.playerBlocks]: {
    path: `${ROUTES_MAP.reports.path}/${ReportType.playerBlocks}`, exact: true, component: PlayerBlocks,
  },
  [ReportType.machineStatus]: {
    path: `${ROUTES_MAP.reports.path}/${ReportType.machineStatus}`, exact: true, component: MachineStatus,
  },
  [ReportType.retention]: {
    path: `${ROUTES_MAP.reports.path}/${ReportType.retention}`, exact: true, component: Retention,
  },
  [ReportType.funnel]: {
    path: `${ROUTES_MAP.reports.path}/${ReportType.funnel}`, exact: true, component: Funnel,
  },
  [ReportType.revenue]: {
    path: `${ROUTES_MAP.reports.path}/${ReportType.revenue}`, exact: true, component: Revenue,
  },
};

const ROUTES = Object.values(reportsRoutesMap);

const Reports = () => {
  const { reportType } = useSelector(reportsReducerSelector);

  return (
    <>
      <ReportsCommandBar />
      <Switch>
        { ROUTES.map(({
          path, ...restProps
        }) => (
          <Route
            key={path}
            path={path}
            {...restProps}
          />
        )) }
        <Redirect to={`${ROUTES_MAP.reports.path}/${ReportType.activity}`} />
      </Switch>
      { reportType && <ProcessedReportsDialog reportType={reportType} /> }
    </>
  );
};

export default Reports;
