import React, { useState, useCallback } from 'react';
import { boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import {
  Table, TableHead, TableRow, TableCell, TableBody, ExpandBtn, CheckboxBase,
} from 'arcadia-common-fe';
import { SessionDetails } from '../../src/modules/sessions/components/Table/SessionDetails/SessionDetails';
import { GET_SESSIONS_RESPONSE_MOCK } from './fixtures';

export default {
  component: Table,
  title: 'Table',
};

export const Sandbox = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const handleExpand = useCallback((id:number) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
    }
  }, [expandedRowId, setExpandedRowId]);

  const handleSelect = (id: number) => {
    let newSelectedRows = [...selectedRows];

    if (newSelectedRows.indexOf(id) !== -1) {
      newSelectedRows = newSelectedRows.filter((item) => item !== id);
    } else {
      newSelectedRows.push(id);
    }

    setSelectedRows(newSelectedRows);
  };

  return (
    <Table
      isLoading={boolean('isLoading', false)}
      count={number('List count (if 0 will see "No result")', 8)}
    >
      <TableHead>
        <TableRow>
          <TableCell isContentWidth />
          <TableCell isContentWidth />
          <TableCell isContentWidth />
          <TableCell>Status</TableCell>
          <TableCell>Session ID</TableCell>
          <TableCell>Group Name</TableCell>
          <TableCell>Machine ID</TableCell>
          <TableCell>Operator Name</TableCell>
          <TableCell>Player CID</TableCell>
          <TableCell>IP Address</TableCell>
          <TableCell>Start Date & Time</TableCell>
          <TableCell>Duration</TableCell>
          <TableCell>Rounds</TableCell>
          <TableCell>Total Winning</TableCell>
          <TableCell>Total NetCash</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {
          GET_SESSIONS_RESPONSE_MOCK && GET_SESSIONS_RESPONSE_MOCK.sessions.map((row, i) => (
            <TableRow
              key={row.id}
              isExpand={expandedRowId === row.id}
              expandComponent={(
                <>
                  <TableCell colSpan={3} />
                  <TableCell colSpan={12}>
                    <SessionDetails
                      onOpenLogs={action('onOpenLogs')}
                      onTerminate={action('onTerminate')}
                      onOpenGroupSettingsJSON={action('onOpenGroupSettingsJSON')}
                      onOpenOperatorSettingsJSON={action('onOpenOperatorSettingsJSON')}
                      onOpenSystemSettingsJSON={action('onOpenSystemSettingsJSON')}
                      onOpenHistory={action('onOpenHistory')}
                      session={row}
                    />
                  </TableCell>
                </>
              )}
            >
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                <CheckboxBase value={selectedRows.indexOf(row.id) !== -1} onChange={() => handleSelect(row.id)} />
              </TableCell>
              <TableCell>
                <ExpandBtn isActive={expandedRowId === row.id} onClick={() => handleExpand(row.id)} />
              </TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.groupName}</TableCell>
              <TableCell>{row.machineId}</TableCell>
              <TableCell>{row.operatorName}</TableCell>
              <TableCell>{row.playerCid}</TableCell>
              <TableCell>{row.ip}</TableCell>
              <TableCell>{row.startDate}</TableCell>
              <TableCell>{row.duration}</TableCell>
              <TableCell>{row.rounds}</TableCell>
              <TableCell>{row.totalWinning}</TableCell>
              <TableCell>{row.totalNetCash}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
