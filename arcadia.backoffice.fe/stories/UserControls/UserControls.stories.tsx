import React from 'react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { UserControls } from 'arcadia-common-fe';

export default {
  component: UserControls,
  title: 'UserControls',
};

export const Sandbox = () => (
  <UserControls
    name={text('name', 'Georges Embolo')}
    onLogOut={action('Log out')}
  />
);
