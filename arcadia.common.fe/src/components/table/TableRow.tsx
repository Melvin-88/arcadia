import React, { useCallback } from 'react';
import classNames from 'classnames';
import { ITableCellProps, ExpandClassNameContext } from './TableCell';
import './styles/TableRow.scss';

export interface ITableRowProps {
  className?: string
  index?: number
  isHead?: boolean
  isExpand?: boolean
  expandComponent?: React.ReactElement<ITableCellProps> | React.ReactElement<ITableCellProps>[]
  onExpand?: () => void
}

export const TableRow: React.FC<ITableRowProps> = ({
  className,
  index = 0,
  isExpand,
  expandComponent,
  isHead,
  children,
  onExpand,
}) => {
  const rootChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement<ITableCellProps>(child)) {
      return child;
    }

    return (
      React.cloneElement(child, { isHead })
    );
  });
  const classes = classNames(
    'table-row',
    {
      'table-row--filled': (index + 1) % 2 === 0,
    },
    className,
  );

  const handleClick = useCallback(() => {
    if (expandComponent && onExpand) {
      onExpand();
    }
  }, [expandComponent, onExpand]);

  return (
    <>
      <tr className={classes} onClick={handleClick}>
        { rootChildren }
      </tr>
      { expandComponent && (
        <tr className={classNames('table-row table-row--expand-row', { 'table-row--open': isExpand })}>
          <ExpandClassNameContext.Provider value="table-row__cell">
            {expandComponent}
          </ExpandClassNameContext.Provider>
        </tr>
      ) }
    </>
  );
};
