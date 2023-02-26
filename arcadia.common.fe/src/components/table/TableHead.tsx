import React from 'react';
import classNames from 'classnames';
import { ITableRowProps } from './TableRow';

export interface ITableHeadProps {
  className?: string
  children: React.ReactElement<ITableRowProps>;
}

export const TableHead: React.FC<ITableHeadProps> = ({
  className,
  children,
}) => (
  <thead className={classNames('table-head', className)}>
    {React.Children.map(children, (child: React.ReactElement<ITableRowProps>) => React.cloneElement(child, { isHead: true }))}
  </thead>
);
