import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
} from 'arcadia-common-fe';
import { IChips } from '../../../types';

export interface IAdministrationTableFindChipProps {
  isLoading?: boolean
  chips: IChips
  total: number
}

export const AdministrationTableFindChip: React.FC<IAdministrationTableFindChipProps> = ({
  isLoading,
  chips,
  total,
}) => (
  <Table
    isLoading={isLoading}
    count={total}
  >
    <TableHead>
      <TableRow>
        <TableCell isContentWidth />
        <TableCell>RFID</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Site Id</TableCell>
        <TableCell>Type Id</TableCell>
        <TableCell>Value</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {
        chips.map((row, i) => (
          <TableRow key={row.rfid}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{row.rfid}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.siteId}</TableCell>
            <TableCell>{row.typeId}</TableCell>
            <TableCell>{row.value}</TableCell>
          </TableRow>
        ))
      }
    </TableBody>
  </Table>
);
