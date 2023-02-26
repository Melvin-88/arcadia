import React from 'react';
import classNames from 'classnames';
import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { Dialog, DialogType } from 'arcadia-common-fe';
import './Dialog.stories.scss';

export default {
  component: Dialog,
  title: 'Dialog',
};

const dialogTypeOptions = {
  [DialogType.default]: DialogType.default,
  [DialogType.wide]: DialogType.wide,
};

export const Sandbox = () => (
  <Dialog
    className={classNames(text('className', ''))}
    dialogType={select('variant', dialogTypeOptions, DialogType.default)}
    title={text('title', 'Save Changes')}
    isOpen={boolean('isOpen', true)}
    onClose={action('onClose')}
  >
    <div className="dialog-story__content">
      { text('content', `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industrys standard dummy text ever since the 1500s
      `) }
    </div>
  </Dialog>
);
