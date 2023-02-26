import React from 'react';
import { ITableRowProps } from './TableRow';

export interface ITableBodyProps {
  children: React.ReactElement<ITableRowProps>[] | null
}

export const TableBody: React.FC<ITableBodyProps> = ({
  children,
}) => (
  <tbody>
    {children && React.Children.map(children, (child, i) => (React.cloneElement(child, { index: i })))}
  </tbody>
);
