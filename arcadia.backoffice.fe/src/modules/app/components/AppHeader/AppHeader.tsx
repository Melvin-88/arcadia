import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { UserControls } from 'arcadia-common-fe';
import { logOut } from '../../../auth/actions';
import { userSelector } from '../../../auth/selectors';
import { NavBar } from './NavBar/NavBar';
import './AppHeader.scss';

interface IAppHeaderProps {
  className?: string
}

export const AppHeader: React.FC<IAppHeaderProps> = ({ className }) => {
  const dispatch = useDispatch();

  const handleLogOut = useCallback(() => {
    dispatch(logOut());
  }, []);

  const user = useSelector(userSelector);
  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <div className={classNames('app-header', className)}>
      <NavBar className="app-header__nav-bar" />
      <UserControls
        name={fullName}
        onLogOut={handleLogOut}
      />
    </div>
  );
};
