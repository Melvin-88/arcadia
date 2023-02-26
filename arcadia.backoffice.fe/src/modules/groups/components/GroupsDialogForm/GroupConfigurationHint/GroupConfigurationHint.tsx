import React from 'react';
import './GroupConfigurationHint.scss';

export const GroupConfigurationHint = () => (
  <div className="group-configuration-hint">
    Available options for 'slot' config:
    <ul className="group-configuration-hint__list">
      <li>orange</li>
      <li>apple</li>
      <li>lemon</li>
      <li>strawberry</li>
      <li>plum</li>
      <li>ace</li>
      <li>seven</li>
      <li>cherry</li>
    </ul>
    The last item in the config will be used for scatter.
  </div>
);
