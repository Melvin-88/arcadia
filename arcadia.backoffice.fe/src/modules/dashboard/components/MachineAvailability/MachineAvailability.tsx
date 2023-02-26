import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Spinner, Table, TableBody, TableCell, TableHead, TableRow,
} from 'arcadia-common-fe';
import classnames from 'classnames';
import _isEqual from 'lodash/isEqual';
import _sortBy from 'lodash/sortBy';
import { getMachineAvailability, setMachineAvailabilityFilterValues } from '../../state/actions';
import { machineAvailabilitySelector } from '../../state/selectors';
import { GroupsSelection } from '../GroupsSelection/GroupsSelection';
import { MACHINES_AVAILABILITY_UPDATE_INTERVAL } from '../../constants';
import './MachineAvailability.scss';

interface IMachineAvailabilityProps {
  className?: string
}

export const MachineAvailability: React.FC<IMachineAvailabilityProps> = ({ className }) => {
  const dispatch = useDispatch();
  const {
    isLoading, countInPlay, countReady, filterValues,
  } = useSelector(machineAvailabilitySelector);

  const handleSubmitForm = useCallback((values) => {
    if (filterValues?.groupId && !_isEqual(_sortBy(values.groupId), _sortBy(filterValues.groupId))) {
      dispatch(setMachineAvailabilityFilterValues(values));
    }
  }, [filterValues]);

  const handleGetMachineAvailability = useCallback(() => {
    if (filterValues) {
      dispatch(getMachineAvailability(filterValues));
    }
  }, [filterValues]);

  useEffect(() => {
    handleGetMachineAvailability();

    const interval = setInterval(() => {
      handleGetMachineAvailability();
    }, MACHINES_AVAILABILITY_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetMachineAvailability]);

  return (
    <div className={classnames('machine-availability', className)}>
      {
        isLoading ? (
          <Spinner className="machine-availability__spinner" />
        ) : (
          <>
            <Table isLoading={isLoading}>
              <TableHead>
                <TableRow>
                  <TableCell>Machines in play</TableCell>
                  <TableCell>Machines ready</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>
                    {countInPlay}
                  </TableCell>
                  <TableCell>
                    {countReady}
                  </TableCell>
                </TableRow>
                <TableRow />
              </TableBody>
            </Table>
            <GroupsSelection
              onSubmitForm={handleSubmitForm}
              filterValues={filterValues}
            />
          </>
        )
      }
    </div>
  );
};
