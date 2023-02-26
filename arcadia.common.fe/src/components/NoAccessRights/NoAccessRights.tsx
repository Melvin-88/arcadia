import React from 'react';
import IconUser from '../../assets/svg/user.svg';
import './NoAccessRights.scss';

export const NoAccessRights = () => (
  <div className="no-access-rights">
    <IconUser className="no-access-rights__icon" />
    <h2 className="no-access-rights__title">No Access Rights</h2>
    <p className="no-access-rights__description">You do not have permission to access.</p>
  </div>
);

export default NoAccessRights;
