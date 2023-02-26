import React from 'react';
import { boolean, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ActionType, DialogAction } from '../../../src/components/dialogs/DialogAction/DialogAction';

export default {
  component: DialogAction,
  title: 'DialogAction',
};

export const Sandbox = () => (
  <DialogAction
    actionType={select('actionType', ActionType, ActionType.positive)}
    isOpen={boolean('isOpen', true)}
    action={text('action', 'Terminate')}
    subject={text('subject', 'Session')}
    onSubmit={action('onSubmit')}
    onClose={action('onClose')}
  />
);
