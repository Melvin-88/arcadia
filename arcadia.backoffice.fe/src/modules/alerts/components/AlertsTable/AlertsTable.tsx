import React, { useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ExpandBtn,
  CheckboxBase,
  useTableItemsSelection,
  useTableSortingWithRouting,
  useExpand,
  getDateTimeFormatted,
  convertDataToJSON,
} from 'arcadia-common-fe';
import { IAlertsEntities, AlertId } from '../../types';
import { AlertsStatus } from './AlertsStatus/AlertsStatus';
import { AlertDetails } from './AlertsDetails/AlertsDetails';
import { setDialogJSONViewer } from '../../../DialogJSONViewer/actions';
import { selectedAlertsSelector } from '../../state/selectors';
import { setSelectedAlerts } from '../../state/actions';
import FlagIcon from '../../../../assets/svg/flag.svg';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { HistoryType } from '../../../history/types';
import { getHistoryData } from '../../../history/state/actions';
import { AlertTypeLabel } from '../../../../components/alerts/AlertTypeLabel/AlertTypeLabel';
import { AlertSeverityLabel } from '../../../../components/alerts/AlertSeverityLabel/AlertSeverityLabel';
import './AlertsTable.scss';

interface IAlertsTableProps {
  isLoading: boolean
  total: number
  ids: AlertId[]
  offset: number
  entities: IAlertsEntities
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'isFlagged', label: 'Is Flagged', Icon: FlagIcon },
  { key: 'id', label: 'Alert ID' },
  { key: 'type', label: 'Alert Type' },
  { key: 'severity', label: 'Severity' },
  { key: 'source', label: 'Source' },
  { key: 'date', label: 'Date & Time' },
  { key: 'description', label: 'Description' },
];

export const AlertsTable: React.FC<IAlertsTableProps> = ({
  isLoading,
  total,
  offset,
  ids,
  entities,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const { handleExpand, handleResetExpand, isExpanded } = useExpand();
  const { handleSelectItem, isItemSelected } = useTableItemsSelection(selectedAlertsSelector, setSelectedAlerts);

  useEffect(() => {
    handleResetExpand();

    return () => {
      dispatch(setSelectedAlerts([]));
    };
  }, [entities]);

  const handleOpenAdditionalInformationJSON = useCallback((id: AlertId) => {
    const currentAlert = entities[id];

    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(currentAlert?.additionalInfo),
    }));
  }, [entities]);

  const handleOpenHistory = useCallback((id) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.alerts,
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
            <TableCell isContentWidth />
            { headCells.map(({ key, label, Icon }) => (
              <TableCell
                key={key}
                sortOrder={sortBy === key ? sortOrder : undefined}
                onClick={createSortHandler(key)}
              >
                { Icon ? <Icon className="alerts-table__icon" /> : label }
              </TableCell>
            )) }
          </TableRow>
        </TableHead>

        <TableBody>
          {
            ids.map((id, i) => {
              const alert = entities[id];

              return (
                <TableRow
                  key={id}
                  isExpand={isExpanded(id)}
                  expandComponent={(
                    <>
                      <TableCell colSpan={2} />
                      <TableCell colSpan={9}>
                        <AlertDetails
                          {...alert}
                          onOpenAdditionalInformationJSON={handleOpenAdditionalInformationJSON}
                          onOpenHistory={handleOpenHistory}
                        />
                      </TableCell>
                    </>
                  )}
                  onExpand={() => handleExpand(id)}
                >
                  <TableCell>{offset + i + 1}</TableCell>
                  <TableCell>
                    <CheckboxBase
                      value={isItemSelected(id)}
                      onChange={(value, event) => {
                        event.stopPropagation();
                        handleSelectItem(id);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <ExpandBtn isActive={isExpanded(id)} />
                  </TableCell>
                  <TableCell><AlertsStatus status={alert.status} /></TableCell>
                  <TableCell>
                    <FlagIcon className={classNames('alerts-table__icon', { 'alerts-table__icon--flagged': alert.isFlagged })} />
                  </TableCell>
                  <TableCell>{id}</TableCell>
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
              );
            })
          }
        </TableBody>
      </Table>
      <HistoryDialog />
    </>
  );
};
