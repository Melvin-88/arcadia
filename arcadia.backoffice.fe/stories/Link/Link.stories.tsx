import React from 'react';
import classNames from 'classnames';
import { boolean, select, text } from '@storybook/addon-knobs';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ILinkProps, Link, LinkColor } from 'arcadia-common-fe';
import './styles/Link.stories.scss';

export default {
  component: Link,
  title: 'Link',
};

const ROUTES_MAP = {
  dashboard: {
    path: '/dashboard',
  },
  profile: {
    path: '/profile',
  },
};

const colorSelectOptions = {
  [LinkColor.primary]: LinkColor.primary,
  [LinkColor.secondary]: LinkColor.secondary,
};

const renderLinkWithProps = ({ children, ...restProps }: Partial<ILinkProps>) => (
  <Link
    className={classNames('link-story__link', text('className', ''))}
    to={text('to', '')}
    exact={boolean('exact', true)}
    nativeElement={boolean('nativeElement', false)}
    {...restProps}
  >
    { children || 'Link text' }
  </Link>
);

const renderPrimaryLink = (props?: ILinkProps) => renderLinkWithProps({
  children: 'Primary Link ',
  ...props,
});

const renderSecondaryLink = (props?: ILinkProps) => renderLinkWithProps({
  color: LinkColor.secondary,
  children: 'Secondary Link ',
  ...props,
});

export const StandardAll = (props?: ILinkProps) => (
  <>
    { renderPrimaryLink(props) }
    <hr />
    { renderSecondaryLink(props) }
  </>
);

export const WithRouter = () => (
  <>
    <Link className="link-story__link" to={ROUTES_MAP.dashboard.path}>
      Dashboard
    </Link>
    <Link className="link-story__link" to={ROUTES_MAP.profile.path}>
      Profile
    </Link>
    <hr />
    Current route:&nbsp;
    <Switch>
      <Route path={ROUTES_MAP.dashboard.path}>
        Dashboard
      </Route>
      <Route path={ROUTES_MAP.profile.path}>
        Profile
      </Route>
      <Redirect to={ROUTES_MAP.dashboard.path} />
    </Switch>
  </>
);

export const Sandbox = () => renderLinkWithProps({
  color: select('color', colorSelectOptions, undefined),
});
