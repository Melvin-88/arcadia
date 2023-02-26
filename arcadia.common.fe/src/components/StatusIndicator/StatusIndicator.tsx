import React from 'react';
import classNames from 'classnames';
import './StatusIndicator.scss';

export enum StatusIndicatorColor {
  blue = 'blue',
  green = 'green',
  yellow = 'yellow',
  orange = 'orange',
  grey = 'grey',
  red = 'red',
}

export interface IStatusIndicatorProps {
  className?: string
  color: StatusIndicatorColor
}

export const StatusIndicator: React.FC<IStatusIndicatorProps> = ({
  className,
  color,
  children,
}) => (
  <div
    className={classNames(
      'status-indicator',
      className,
    )}
  >
    <div className={classNames(
      'status-indicator__circle',
      `status-indicator__circle--${color}`,
    )}
    />
    { children }
  </div>
);
