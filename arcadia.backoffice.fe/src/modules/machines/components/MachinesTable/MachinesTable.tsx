import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ExpandBtn,
  secondsToTimeSpan,
  useTableSortingWithRouting,
  useExpand,
  convertDataToJSON,
} from 'arcadia-common-fe';
import {
  IMachine, IMachines, MachineAction, MachineId,
} from '../../types';
import { MachinesStatus } from './MachinesStatus/MachinesStatus';
import { MachineDetails } from './MachineDetails/MachineDetails';
import {
  setDialogActivateMachine, setMachinesDialogAction, setMachinesDialogForm, setDialogReassignMachine,
} from '../../state/actions';
import { MachineDialogActivate } from './MachineDialogActivate/MachineDialogActivate';
import { setDialogJSONViewer } from '../../../DialogJSONViewer/actions';
import { QueuesStatus } from './QueuesStatus/QueuesStatus';
import { MachineDialogAction } from './MachineDialogAction/MachineDialogAction';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { getHistoryData } from '../../../history/state/actions';
import { HistoryType } from '../../../history/types';
import { MachineDialogReassign } from './MachineDialogReassign/MachineDialogReassign';
import './MachinesTable.scss';

interface IMachinesTableProps {
  isLoading: boolean
  offset: number
  total: number
  machines: IMachines
}

const headCells = [
  { key: 'status', label: 'Machine Status' },
  { key: 'queueStatus', label: 'Queue Status' },
  { key: 'id', label: 'Machine ID' },
  { key: 'name', label: 'Machine Name' },
  { key: 'groupName', label: 'Group Name' },
  { key: 'site', label: 'Site' },
  { key: 'viewers', label: 'Observers' },
  { key: 'inQueue', label: 'In Queue' },
  { key: 'uptime', label: 'Uptime' },
  { key: 'videoLink', label: 'Video Link' },
];

export const MachinesTable: React.FC<IMachinesTableProps> = ({
  isLoading,
  offset,
  total,
  machines,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const { handleExpand, handleResetExpand, isExpanded } = useExpand();

  const handleSetDialogAction = useCallback((id: number, action: MachineAction) => {
    dispatch(setMachinesDialogAction({
      id,
      action,
      isOpen: true,
    }));
  }, []);

  const handleActivate = useCallback((id: MachineId) => {
    dispatch(setDialogActivateMachine({
      id,
      isOpen: true,
    }));
  }, []);

  const handleReassign = useCallback((id: MachineId) => {
    dispatch(setDialogReassignMachine({ id, isOpen: true }));
  }, []);

  const handleDry = useCallback((id: MachineId) => {
    handleSetDialogAction(id, MachineAction.dry);
  }, [handleSetDialogAction]);

  const handleShutdown = useCallback((id: MachineId) => {
    handleSetDialogAction(id, MachineAction.shutdown);
  }, [handleSetDialogAction]);

  const handleRemove = useCallback((id: MachineId) => {
    handleSetDialogAction(id, MachineAction.remove);
  }, [handleSetDialogAction]);

  const handleReboot = useCallback((id: MachineId) => {
    handleSetDialogAction(id, MachineAction.reboot);
  }, [handleSetDialogAction]);

  const handleEdit = useCallback((id: MachineId) => {
    const machine = machines.find((item) => item.id === id);

    dispatch(setMachinesDialogForm({
      isOpen: true,
      initialValues: machine,
    }));
  }, [machines]);

  useEffect(() => {
    handleResetExpand();
  }, [machines]);

  const handleOpenChipsOnTableJSON = useCallback((id: MachineId) => {
    const currentMachine = machines.find((machine: IMachine) => machine.id === id);

    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(currentMachine?.chipsOnTable),
    }));
  }, [machines]);

  const handleOpenConfigurationJSON = useCallback((id: MachineId) => {
    const currentMachine = machines.find((machine: IMachine) => machine.id === id);

    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(currentMachine?.configuration),
    }));
  }, [machines]);

  const handleOpenHistory = useCallback((id) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.machines,
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
            machines.map((machine, i) => (
              <TableRow
                key={machine.id}
                isExpand={isExpanded(machine.id)}
                expandComponent={(
                  <>
                    <TableCell colSpan={2} />
                    <TableCell className="machines-table__details-cell" colSpan={10}>
                      <MachineDetails
                        {...machine}
                        onEdit={handleEdit}
                        onActivate={handleActivate}
                        onDry={handleDry}
                        onShutdown={handleShutdown}
                        onRemove={handleRemove}
                        onOpenChipsOnTableJSON={handleOpenChipsOnTableJSON}
                        onOpenConfigurationJSON={handleOpenConfigurationJSON}
                        onOpenHistory={handleOpenHistory}
                        onReassign={handleReassign}
                        onReboot={handleReboot}
                      />
                    </TableCell>
                  </>
                )}
                onExpand={() => handleExpand(machine.id)}
              >
                <TableCell>{offset + i + 1}</TableCell>
                <TableCell>
                  <ExpandBtn isActive={isExpanded(machine.id)} />
                </TableCell>
                <TableCell>
                  <MachinesStatus status={machine.status} />
                </TableCell>
                <TableCell>
                  <QueuesStatus status={machine.queueStatus} />
                </TableCell>
                <TableCell>{machine.id}</TableCell>
                <TableCell>{machine.name}</TableCell>
                <TableCell>{machine.groupName}</TableCell>
                <TableCell>{machine.siteName}</TableCell>
                <TableCell>{machine.viewers}</TableCell>
                <TableCell>{machine.inQueue}</TableCell>
                <TableCell>
                  { secondsToTimeSpan(machine.uptime || 0) }
                </TableCell>
                <TableCell>{machine.videoLink}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <MachineDialogAction />
      <MachineDialogActivate />
      <HistoryDialog />
      <MachineDialogReassign />
    </>
  );
};
