import React from 'react';
import classNames from 'classnames';
import ExpandIcon from '../../assets/svg/expand.svg';
import './styles/ExpandBtn.scss';

interface IExpandBtnProps {
  className?: string
  isActive: boolean
  onClick?: () => void
}

export const ExpandBtn: React.FC<IExpandBtnProps> = ({
  className,
  isActive,
  onClick,
}) => (
  <button
    className={classNames(
      'expand-btn',
      { 'expand-btn--active': isActive },
      className,
    )}
    onClick={onClick}
  >
    <ExpandIcon />
  </button>
);
