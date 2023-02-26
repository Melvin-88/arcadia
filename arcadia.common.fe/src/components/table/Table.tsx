import React from 'react';
import classNames from 'classnames';
import { Spinner } from '../loaders/Spinner/Spinner';
import { EmptyState } from '../EmptyState/EmptyState';
import './styles/Table.scss';

export interface ITableProps extends Partial<React.TableHTMLAttributes<HTMLTableElement>> {
  isLoading?: boolean
  count?: number | null
}

export const Table: React.FC<ITableProps> = ({
  className,
  isLoading,
  count,
  children,
  ...restProps
}) => (
  <div className="table">
    {
      isLoading //eslint-disable-line
        ? <Spinner className="table__spinner" />
        : count === 0
          ? <EmptyState />
          : (
            <table
              className={classNames('table-container', className)}
              {...restProps}
            >
              {children}
            </table>
          )
    }
  </div>
);
