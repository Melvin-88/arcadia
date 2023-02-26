import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDateTimeFormatted,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'arcadia-common-fe';
import classnames from 'classnames';
import { getLatestAlerts } from '../../state/actions';
import { latestAlertsSelector } from '../../state/selectors';
import { AlertSeverityLabel } from '../../../../components/alerts/AlertSeverityLabel/AlertSeverityLabel';
import { LATEST_ALERTS_UPDATE_INTERVAL } from '../../constants';
import './LatestAlerts.scss';

interface ILatestAlertsProps {
  className?: string
}

export const LatestAlerts: React.FC<ILatestAlertsProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { isLoading, alerts } = useSelector(latestAlertsSelector);

  const handleGetLatestAlerts = useCallback(() => {
    dispatch(getLatestAlerts());
  }, []);

  useEffect(() => {
    handleGetLatestAlerts();

    const interval = setInterval(() => {
      handleGetLatestAlerts();
    }, LATEST_ALERTS_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [handleGetLatestAlerts]);

  return (
    <div className={classnames('latest-alerts', className)}>
      {
        isLoading ? (
          <Spinner className="latest-alerts__spinner" />
        ) : (
          <>
            <div className="latest-alerts__title">Latest alerts (by severity)</div>
            <Table isLoading={isLoading}>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Alert</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Severity</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  alerts.map(({
                    date, alert, type, severity,
                  }) => (
                    <TableRow key={date + severity + alert}>
                      <TableCell>{getDateTimeFormatted(date)}</TableCell>
                      <TableCell>{alert}</TableCell>
                      <TableCell>{type}</TableCell>
                      <TableCell>
                        <AlertSeverityLabel severity={severity} />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </>
        )
      }
    </div>
  );
};
