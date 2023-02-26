import React from 'react';
import IconComingSoon from '../../assets/svg/time.svg';
import './styles/ComingSoon.scss';

export const ComingSoon = () => (
  <div className="coming-soon">
    <IconComingSoon className="coming-soon__icon" />
    <h2 className="coming-soon__title">Coming Soon</h2>
    <p className="coming-soon__description">We are currently working on this page</p>
  </div>
);

export default ComingSoon;
