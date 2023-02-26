import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import _sortBy from 'lodash/sortBy';
import { getMachinesStatus, setMachineStatusFilterValues } from '../../state/actions';
import { machinesStatusSelector } from '../../state/selectors';
import { PieChart } from '../PieChart/PieChart';
import {
  MachinesStatusLabel, MachinesStatusColor, IMachinesStatusChartData,
} from '../../types';
import { GroupsSelection } from '../GroupsSelection/GroupsSelection';
import { MACHINE_STATUS_UPDATE_INTERVAL } from '../../constants';

interface IMachinesStatusProps {
  className?: string
}

export const MachinesStatus: React.FC<IMachinesStatusProps> = ({ className }) => {
  const dispatch = useDispatch();
  const {
    isLoading,
    countError,
    countOffline,
    countShuttingDown,
    countDrying,
    countPreparing,
    countInPlay,
    countSeeding,
    countReady,
    filterValues,
  } = useSelector(machinesStatusSelector);

  const handleSubmitForm = useCallback((values) => {
    if (filterValues?.groupId && !_isEqual(_sortBy(values.groupId), _sortBy(filterValues.groupId))) {
      dispatch(setMachineStatusFilterValues(values));
    }
  }, [filterValues]);

  const data: IMachinesStatusChartData = useMemo(() => ([
    { name: MachinesStatusLabel.error, value: countError, color: MachinesStatusColor.error },
    { name: MachinesStatusLabel.offline, value: countOffline, color: MachinesStatusColor.offline },
    { name: MachinesStatusLabel.shuttingDown, value: countShuttingDown, color: MachinesStatusColor.shuttingDown },
    { name: MachinesStatusLabel.drying, value: countDrying, color: MachinesStatusColor.drying },
    { name: MachinesStatusLabel.preparing, value: countPreparing, color: MachinesStatusColor.preparing },
    { name: MachinesStatusLabel.inPlay, value: countInPlay, color: MachinesStatusColor.inPlay },
    { name: MachinesStatusLabel.seeding, value: countSeeding, color: MachinesStatusColor.seeding },
    { name: MachinesStatusLabel.ready, value: countReady, color: MachinesStatusColor.ready },
  ]), [
    countError,
    countOffline,
    countShuttingDown,
    countDrying,
    countPreparing,
    countInPlay,
    countSeeding,
    countReady,
  ]);

  const handleGetMachinesStatus = useCallback(() => {
    if (filterValues) {
      dispatch(getMachinesStatus(filterValues));
    }
  }, [filterValues]);

  useEffect(() => {
    handleGetMachinesStatus();

    const interval = setInterval(() => {
      handleGetMachinesStatus();
    }, MACHINE_STATUS_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetMachinesStatus]);

  return (
    <PieChart
      className={className}
      title="Machines status"
      data={data}
      isLoading={isLoading}
      footerContent={(
        <GroupsSelection
          onSubmitForm={handleSubmitForm}
          filterValues={filterValues}
        />
      )}
    />
  );
};
