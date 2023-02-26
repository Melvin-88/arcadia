import React from 'react';
import { CommandBar, ICommandBarItems, AddIcon } from 'arcadia-common-fe';
import { action } from '@storybook/addon-actions';

export default {
  component: CommandBar,
  title: 'CommandBar',
};

const items: ICommandBarItems = [
  { text: 'Add', Icon: AddIcon, onClick: action('onClick') },
];

export const Sandbox = () => (
  <CommandBar items={items} />
);
