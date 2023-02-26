import React from 'react';
import { Link } from '../Link/Link';
import IconNoMatch from '../../assets/svg/404.svg';
import './NoMatch.scss';

export const NoMatch = () => (
  <div className="no-match">
    <IconNoMatch className="no-match__icon" />
    <h2 className="no-match__title">Page Not Found</h2>
    <p className="no-match__description">
      The page you are looking for might have been removed
      <br />
      or its name changed or is temporarily unavailable.
    </p>
    <p>
      <Link to="/">Home</Link>
    </p>
  </div>
);
