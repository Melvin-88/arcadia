import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PlayersPerDay } from './PlayersPerDay/PlayersPerDay';
import { CurrentActives } from './CurrentActives/CurrentActives';
import { ActiveSessionsBreakdown } from './ActiveSessionsBreakdown/ActiveSessionsBreakdown';
import { ActiveAndNewPlayers } from './ActiveAndNewPlayers/ActiveAndNewPlayers';
import { BettingActivity } from './BettingActivity/BettingActivity';
import { TopWinnersAndLosers } from './TopWinnersAndLosers/TopWinnersAndLosers';
import { WaitTime } from './WaitTime/WaitTime';
import { MachineAvailability } from './MachineAvailability/MachineAvailability';
import { MachinesStatus } from './MachinesStatus/MachinesStatus';
import { LatestAlerts } from './LatestAlerts/LatestAlerts';
import { getGroups } from '../state/actions';
import './Dashboard.scss';

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGroups());
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__columns">
        <div>
          <PlayersPerDay />
          <CurrentActives className="dashboard__current-actives" />
          <ActiveSessionsBreakdown className="dashboard__active-sessions-breakdown" />
        </div>
        <div>
          <ActiveAndNewPlayers />
          <BettingActivity className="dashboard__betting-activity" />
          <TopWinnersAndLosers className="dashboard__top-winners-and-losers" />
        </div>
        <div>
          <WaitTime />
          <MachineAvailability className="dashboard__machine-availability" />
          <MachinesStatus className="dashboard__machine-availability" />
        </div>
        <div className="dashboard__latest-alerts-column">
          <LatestAlerts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
