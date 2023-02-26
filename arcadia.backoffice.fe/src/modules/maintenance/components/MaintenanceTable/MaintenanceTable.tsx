import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ExpandBtn,
  useTableSortingWithRouting,
  useExpand,
  getDateTimeFormatted,
  convertDataToJSON,
} from 'arcadia-common-fe';
import {
  IAlerts, AlertId, IAlert, MaintenanceAction,
} from '../../types';
import { MaintenanceDetails } from '../MaintenanceDetails/MaintenanceDetails';
import { setDialogJSONViewer } from '../../../DialogJSONViewer/actions';
import { MaintenanceDialogAction } from './MaintenanceDialogAction/MaintenanceDialogAction';
import { setMaintenanceDialogAction, setMaintenanceDialogMachineIdentification } from '../../state/actions';
import { MaintenanceDialogMachineIdentification } from './MaintenanceDialogMachineIdentification/MaintenanceDialogMachineIdentification';
import { MaintenanceDialogQRScan } from './MaintenanceDialogQRScan/MaintenanceDialogQRScan';
import { AlertTypeLabel } from '../../../../components/alerts/AlertTypeLabel/AlertTypeLabel';
import { AlertSeverityLabel } from '../../../../components/alerts/AlertSeverityLabel/AlertSeverityLabel';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { getHistoryData } from '../../../history/state/actions';
import { HistoryType } from '../../../history/types';

interface IMaintenanceTableProps {
  isLoading: boolean
  total: number
  offset: number
  alerts: IAlerts
}

const headCells = [
  { key: 'id', label: 'Alert ID' },
  { key: 'type', label: 'Alert Type' },
  { key: 'severity', label: 'Severity' },
  { key: 'source', label: 'Source' },
  { key: 'date', label: 'Date & Time' },
  { key: 'description', label: 'Description' },
];

export const MaintenanceTable: React.FC<IMaintenanceTableProps> = ({
  isLoading,
  total,
  offset,
  alerts,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const { handleExpand, handleResetExpand, isExpanded } = useExpand();

  useEffect(() => {
    handleResetExpand();
  }, [alerts]);

  const handleOpenAdditionalInformationJSON = useCallback((id: AlertId) => {
    const currentAlert = alerts.find((alert: IAlert) => alert.id === id);

    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(currentAlert?.additionalInfo),
    }));
  }, [alerts]);

  const handleOpenActionDialog = useCallback((type: MaintenanceAction, id: AlertId) => {
    if (type !== MaintenanceAction.dismiss) {
      dispatch(setMaintenanceDialogMachineIdentification({
        id,
        action: type,
        isOpen: true,
      }));
    } else {
      dispatch(setMaintenanceDialogAction({
        id,
        action: type,
        isOpen: true,
      }));
    }
  }, []);

  const handleOpenHistory = useCallback((id) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.maintenance,
    }));
  }, []);

  return (
    <>
      <Table
        isLoading={isLoading}
        count={total}
      >
        <TableHead>
          <TableRow>
            <TableCell isContentWidth />
            <TableCell isContentWidth />
            { headCells.map(({ key, label }) => (
              <TableCell
                key={key}
                sortOrder={sortBy === key ? sortOrder : undefined}
                onClick={createSortHandler(key)}
              >
                { label }
              </TableCell>
            )) }
          </TableRow>
        </TableHead>

        <TableBody>
          {
            alerts.map((alert, i) => (
              <TableRow
                key={alert.id}
                isExpand={isExpanded(alert.id)}
                expandComponent={(
                  <>
                    <TableCell colSpan={2} />
                    <TableCell colSpan={9}>
                      <MaintenanceDetails
                        {...alert}
                        onOpenAdditionalInformationJSON={handleOpenAdditionalInformationJSON}
                        onAction={handleOpenActionDialog}
                        onOpenHistory={handleOpenHistory}
                      />
                    </TableCell>
                  </>
                )}
                onExpand={() => handleExpand(alert.id)}
              >
                <TableCell>{offset + i + 1}</TableCell>
                <TableCell>
                  <ExpandBtn isActive={isExpanded(alert.id)} />
                </TableCell>
                <TableCell>{alert.id}</TableCell>
                <TableCell>
                  <AlertTypeLabel type={alert.type} />
                </TableCell>
                <TableCell>
                  <AlertSeverityLabel severity={alert.severity} />
                </TableCell>
                <TableCell>{alert.source}</TableCell>
                <TableCell>{getDateTimeFormatted(alert.date)}</TableCell>
                <TableCell>{alert.description}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <MaintenanceDialogAction />
      <MaintenanceDialogMachineIdentification />
      <MaintenanceDialogQRScan />
      <HistoryDialog />
    </>
  );
};
