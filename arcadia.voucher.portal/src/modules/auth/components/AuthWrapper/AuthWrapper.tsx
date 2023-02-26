import React from 'react';
import classNames from 'classnames';
import './styles/AuthWrapper.scss';

export interface IAuthWrapperProps {
  className?: string
  icon?: React.ReactNode
  title?: string
}

export const AuthWrapper: React.FC<IAuthWrapperProps> = ({
  className, icon, title, children,
}) => (
  <div className={classNames('auth-wrapper', className)}>
    <div className="auth-wrapper__left-side">
      {icon}
    </div>
    <div className="auth-wrapper__right-side">
      <div className="auth-wrapper__content">
        <h1 className="auth-wrapper__title">{title}</h1>
        {children}
      </div>
    </div>
  </div>
);
