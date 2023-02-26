import React from 'react';
import classNames from 'classnames';
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { DialogConfirmation } from 'arcadia-common-fe';
import './DialogConfirmation.stories.scss';

export default {
  component: DialogConfirmation,
  title: 'DialogConfirmation',
};

export const Sandbox = () => (
  <DialogConfirmation
    className={classNames(text('className', ''))}
    title={text('title', 'Save Changes')}
    isOpen={boolean('isOpen', true)}
    cancelText={text('cancelText', 'Cancel')}
    submitText={text('submitText', 'Submit')}
    onClose={action('onClose')}
    onSubmit={action('onSubmit')}
  >
    <div className="dialog-confirmation-story__content">
      { text('content', `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industrys standard dummy text ever since the 1500s
      `) }
    </div>
  </DialogConfirmation>
);
