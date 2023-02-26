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
  convertDataToJSON,
  covertBooleanToYesNo,
  formatDenominator,
} from 'arcadia-common-fe';
import classNames from 'classnames';
import {
  GroupAction, GroupId, IGroupsEntities,
} from '../../types';
import { GroupsStatus } from './GroupsStatus/GroupsStatus';
import { GroupDetails } from './GroupDetails/GroupDetails';
import { GroupDialogAction } from './GroupDialogAction/GroupDialogAction';
import { setGroupsDialogAction, setGroupsDialogForm } from '../../state/actions';
import { setDialogJSONViewer } from '../../../DialogJSONViewer/actions';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { getHistoryData } from '../../../history/state/actions';
import { HistoryType } from '../../../history/types';
import { groupColorIdLabelMap } from '../../constants';
import './GroupsTable.scss';

interface IGroupsTableProps {
  isLoading: boolean
  total: number
  offset: number
  ids: GroupId[]
  entities: IGroupsEntities
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'id', label: 'Group ID' },
  { key: 'name', label: 'Group Name' },
  { key: 'color', label: 'Color Id' },
  { key: 'machinesTotal', label: 'Total Machines' },
  { key: 'machinesIdle', label: 'Idle Machines' },
  { key: 'denominator', label: 'Denominator' },
  { key: 'hasJackpot', label: 'Has Jackpot' },
  { key: 'operators', label: 'Operators' },
];

export const GroupsTable: React.FC<IGroupsTableProps> = ({
  isLoading,
  total,
  offset,
  ids,
  entities,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const {
    handleExpand, handleResetExpand, isExpanded,
  } = useExpand();

  const handleSetDialogAction = useCallback((id: number, action: GroupAction) => {
    dispatch(setGroupsDialogAction({
      id,
      action,
      isOpen: true,
    }));
  }, []);

  const handleEdit = useCallback((id: GroupId) => {
    const group = entities[id];

    dispatch(setGroupsDialogForm({
      isOpen: true,
      initialValues: group,
    }));
  }, [entities]);

  const handleActivate = useCallback((id: GroupId) => {
    handleSetDialogAction(id, GroupAction.activate);
  }, [handleSetDialogAction]);

  const handleDry = useCallback((id: GroupId) => {
    handleSetDialogAction(id, GroupAction.dry);
  }, [handleSetDialogAction]);

  const handleShutdown = useCallback((id: GroupId) => {
    handleSetDialogAction(id, GroupAction.shutdown);
  }, [handleSetDialogAction]);

  const handleRemove = useCallback((id: GroupId) => {
    handleSetDialogAction(id, GroupAction.remove);
  }, [handleSetDialogAction]);

  const handleOpenRegulationsJSON = useCallback((id: GroupId) => {
    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(entities[id].regulation),
    }));
  }, [entities]);

  const handleOpenConfigurationJSON = useCallback((id: GroupId) => {
    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(entities[id].configuration),
    }));
  }, [entities]);

  const handleOpenHistory = useCallback((id) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.groups,
    }));
  }, []);

  const arePowerLinesDifferent = useCallback((totalPowerLineA: number, totalPowerLineB: number) => (
    Math.abs(totalPowerLineA - totalPowerLineB) >= 2
  ), []);

  useEffect(() => {
    handleResetExpand();
  }, [entities]);

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
            ids.map((id, i) => {
              const group = entities[id];

              return (
                <TableRow
                  key={id}
                  isExpand={isExpanded(id)}
                  expandComponent={(
                    <>
                      <TableCell colSpan={2} />
                      <TableCell className="groups-table__details-cell" colSpan={9}>
                        <GroupDetails
                          {...group}
                          onEdit={handleEdit}
                          onActivate={handleActivate}
                          onDry={handleDry}
                          onShutdown={handleShutdown}
                          onRemove={handleRemove}
                          onOpenRegulationsJSON={handleOpenRegulationsJSON}
                          onOpenConfigurationJSON={handleOpenConfigurationJSON}
                          onOpenHistory={handleOpenHistory}
                        />
                      </TableCell>
                    </>
                  )}
                  onExpand={() => handleExpand(id)}
                >
                  <TableCell>{offset + i + 1}</TableCell>
                  <TableCell>
                    <ExpandBtn isActive={isExpanded(id)} />
                  </TableCell>
                  <TableCell>
                    <GroupsStatus status={group.status} />
                  </TableCell>
                  <TableCell>{id}</TableCell>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.color && groupColorIdLabelMap[group.color]}</TableCell>
                  <TableCell>
                    <div
                      className={classNames({
                        'groups-table__power-line-with-diff': arePowerLinesDifferent(group.totalPowerLineA, group.totalPowerLineB),
                      })}
                    >
                      {group.machinesTotal}
                      { `(A: ${group.totalPowerLineA}, B: ${group.totalPowerLineB})` }
                    </div>
                  </TableCell>
                  <TableCell>{group.machinesIdle}</TableCell>
                  <TableCell>
                    { formatDenominator(group.denominator) }
                  </TableCell>
                  <TableCell>{covertBooleanToYesNo(group.hasJackpot)}</TableCell>
                  <TableCell>{covertBooleanToYesNo(group.operators)}</TableCell>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
      <GroupDialogAction />
      <HistoryDialog />
    </>
  );
};
