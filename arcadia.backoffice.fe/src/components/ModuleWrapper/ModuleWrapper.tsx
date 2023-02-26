import React from 'react';
import classNames from 'classnames';
import './styles/ModuleWrapper.scss';

interface IModuleWrapperProps {
  className?: string
  commandBar?: React.ReactNode
  filters?: React.ReactNode
  table: React.ReactNode
  footer?: React.ReactNode
}

export const ModuleWrapper: React.FC<IModuleWrapperProps> = ({
  className,
  commandBar,
  filters,
  table,
  footer,
}) => (
  <div className={classNames(
    'module-wrapper',
    className,
  )}
  >
    { commandBar && <div className="module-wrapper__command-bar">{commandBar}</div> }
    { filters && <div className="module-wrapper__filters">{filters}</div> }
    <div className="module-wrapper__table">{table}</div>
    { footer && <div className="module-wrapper__footer">{footer}</div> }
  </div>
);
