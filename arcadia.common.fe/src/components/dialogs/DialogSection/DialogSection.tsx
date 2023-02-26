import React from 'react';
import classNames from 'classnames';
import './DialogSection.scss';

interface IDialogSectionProps {
  className?: string
}

export const DialogSection: React.FC<IDialogSectionProps> = ({ className, children }) => (
  <div className={classNames('dialog-section', className)}>
    {children}
  </div>
);
