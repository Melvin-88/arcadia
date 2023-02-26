import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Button, IButtonProps } from '../Button/Button';
import './CommandBar.scss';

interface ICommandBarItem extends IButtonProps {
  iconClassName?: string
  text: string
  Icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  onClick?: () => void
}

export type ICommandBarItems = ICommandBarItem[];

interface ICommandBarProps {
  className?: string
  leftContent?: ReactNode
  items: ICommandBarItems
}

export const CommandBar: React.FC<ICommandBarProps> = ({
  className,
  leftContent,
  items,
}) => (
  <div className={classNames(
    'command-bar',
    className,
  )}
  >
    {leftContent}
    { items.map(({
      iconClassName,
      text,
      Icon,
      ...restButtonProps
    }, i) => (
      <Button
        // eslint-disable-next-line react/no-array-index-key
        key={text + i}
        className="command-bar__btn"
        {...restButtonProps}
      >
        { Icon && (
          <Icon className={classNames('command-bar__btn-icon', iconClassName)} />
        ) }
        { text }
      </Button>
    ))}
  </div>
);
