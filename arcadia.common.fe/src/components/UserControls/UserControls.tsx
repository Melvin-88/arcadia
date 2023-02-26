import React from 'react';
import classNames from 'classnames';
import UserFilledIcon from '../../assets/svg/userFilled.svg';
import { Link } from '../Link/Link';
import './styles/UserControls.scss';

interface IUserControlsProps {
  className?: string
  name: string
  onLogOut: () => void
}

export const UserControls: React.FC<IUserControlsProps> = ({ className, name, onLogOut }) => (
  <div className={classNames('user-controls', className)}>
    <div className="user-controls__name">
      <UserFilledIcon className="user-controls__icon" />
      {name}
    </div>
    <Link
      nativeElement
      preventDefault
      onClick={onLogOut}
    >
      Log out
    </Link>
  </div>
);
