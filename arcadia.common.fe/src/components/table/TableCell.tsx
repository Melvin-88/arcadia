import React, { useContext } from 'react';
import classNames from 'classnames';
import ArrowLeftIcon from '../../assets/svg/arrowLeft.svg';
import { SortOrder } from '../../types';
import './styles/TableCell.scss';

export const ExpandClassNameContext = React.createContext('');

export interface ITableCellProps extends Partial<React.TdHTMLAttributes<HTMLTableDataCellElement>>{
  className?: string
  isHead?: boolean
  isContentWidth?: boolean
  sortOrder?: SortOrder
  onClick?: () => void
}

export const TableCell: React.FC<ITableCellProps> = ({
  className,
  children,
  isHead,
  isContentWidth,
  onClick,
  sortOrder,
  ...restProps
}) => {
  const expandClassName = useContext(ExpandClassNameContext);
  const Tag = isHead ? 'th' : 'td';

  let classNameSortIcon = 'table-cell__sort-icon';

  if (sortOrder) {
    classNameSortIcon += ` table-cell__sort-icon--${sortOrder.toLowerCase()}`;
  }

  return (
    <Tag
      className={classNames(
        'table-cell',
        {
          'table-cell--head': isHead,
          'table-cell--width-auto': isContentWidth,
          'table-cell--clickable': !!onClick,
        },
        expandClassName,
        className,
      )}
      onClick={onClick}
      {...restProps}
    >
      { children }
      { isHead && onClick && (
        <ArrowLeftIcon className={classNameSortIcon} />
      ) }
    </Tag>
  );
};
