import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Spinner, Table, TableBody, TableCell, TableHead, TableRow,
} from 'arcadia-common-fe';
import classnames from 'classnames';
import _isEqual from 'lodash/isEqual';
import _sortBy from 'lodash/sortBy';
import { getWaitTime, seWaitTimeFilterValues } from '../../state/actions';
import { waitTimeSelector } from '../../state/selectors';
import ArrowIcon from '../../../../assets/svg/arrow.svg';
import { GroupsSelection } from '../GroupsSelection/GroupsSelection';
import { WAIT_TIME_UPDATE_INTERVAL } from '../../constants';
import './WaitTime.scss';

export const WaitTime = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    averageWaitTimeCurrent,
    averageWaitTime24,
    averageWaitTime24Previous,
    filterValues,
  } = useSelector(waitTimeSelector);

  const awgWaitTimePercent = useMemo(() => {
    if (averageWaitTime24 && averageWaitTime24Previous) {
      return ((averageWaitTime24 / averageWaitTime24Previous) * 100 - 100).toFixed(0);
    }

    return null;
  }, [averageWaitTime24, averageWaitTime24Previous]);

  const handleSubmitForm = useCallback((values) => {
    if (filterValues?.groupId && !_isEqual(_sortBy(values.groupId), _sortBy(filterValues.groupId))) {
      dispatch(seWaitTimeFilterValues(values));
    }
  }, [filterValues]);

  const handleGetWaitTime = useCallback(() => {
    if (filterValues) {
      dispatch(getWaitTime(filterValues));
    }
  }, [filterValues]);

  useEffect(() => {
    handleGetWaitTime();

    const interval = setInterval(() => {
      handleGetWaitTime();
    }, WAIT_TIME_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetWaitTime]);

  return (
    <div className="wait-time">
      {
        isLoading ? (
          <Spinner className="wait-time__spinner" />
        ) : (
          <>
            <Table
              isLoading={isLoading}
              count={2}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Current avg wait time</TableCell>
                  <TableCell>Avg wait time (24h)</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>
                    {averageWaitTimeCurrent}
                  </TableCell>
                  <TableCell>
                    {Number(averageWaitTime24).toFixed(0)}
                    &nbsp;
                    (
                    {Number(averageWaitTime24Previous).toFixed(0)}
                    &nbsp;
                    <ArrowIcon
                      className={classnames(
                        'wait-time__icon',
                        { 'wait-time--negative': awgWaitTimePercent?.indexOf('-') !== -1 },
                      )}
                    />
                    &nbsp;
                    {Number(awgWaitTimePercent).toFixed(0)}
                    %)
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
