import React, { useCallback } from 'react';
import classNames from 'classnames';
import { NavLink as ReactRouterNavLink, NavLinkProps } from 'react-router-dom';
import './styles/Link.scss';

export enum LinkColor {
  primary = 'primary',
  secondary = 'secondary',
}

export interface ILinkProps extends Partial<NavLinkProps<HTMLElement>> {
  className?: string
  to?: string
  target?: string
  nativeElement?: boolean
  color?: LinkColor
  preventDefault?: boolean
}

export const Link: React.FC<ILinkProps> = ({
  className,
  to = '',
  exact = true,
  color = LinkColor.primary,
  preventDefault,
  nativeElement,
  children,
  onClick = () => {},
  ...restProps
}) => {
  const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (preventDefault) {
      event.preventDefault();
    }

    onClick(event);
  }, [preventDefault, onClick]);

  const commonProps = {
    ...restProps,
    className: classNames(`link link--${color}`, className),
    to,
    href: to,
    onClick: handleClick,
  };

  if (nativeElement) {
    return (
      <a {...commonProps}>
        { children }
      </a>
    );
  }

  return (
    <ReactRouterNavLink
      {...commonProps}
      exact={exact}
      activeClassName="link--active"
    >
      { children }
    </ReactRouterNavLink>
  );
};
