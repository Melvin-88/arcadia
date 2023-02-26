import React from 'react';
import classNames from 'classnames';
import { IPaginationProps, Pagination } from '../Pagination/Pagination';
import './styles/TableFooter.scss';

export interface ITableFooterProps {
  className?: string
  total: number
  itemsPerPage: number
  selected?: number | null
  paginationProps?: Partial<IPaginationProps>
}

export const TableFooter: React.FC<ITableFooterProps> = ({
  className,
  selected = null,
  paginationProps,
  total,
  itemsPerPage,
}) => {
  if (!total) {
    return null;
  }

  return (
    <div className={classNames(
      'table-footer',
      className,
    )}
    >
      { selected !== null && (
        <div className="table-footer__selected">
          <>
            Selected:&nbsp;
            { selected }
          </>
        </div>
      ) }
      <Pagination pageCount={total / itemsPerPage} {...paginationProps} />
    </div>
  );
};
