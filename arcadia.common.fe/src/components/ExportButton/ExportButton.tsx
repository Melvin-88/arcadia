import React from 'react';
import classNames from 'classnames';
import { Button, IButtonProps } from '../Button/Button';
import ExportIcon from '../../assets/svg/export.svg';
import './ExportButton.scss';

export interface IExportButtonProps extends IButtonProps {
}

export const ExportButton: React.FC<IExportButtonProps> = ({ className, ...restProps }) => (
  <Button
    className={classNames(
      'export-btn',
      className,
    )}
    {...restProps}
  >
    <ExportIcon className="export-btn__icon" />
  </Button>
);
