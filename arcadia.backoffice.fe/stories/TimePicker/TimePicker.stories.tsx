import React from 'react';
import { TimePickerBase } from 'arcadia-common-fe';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

export default {
  component: TimePickerBase,
  title: 'TimePicker',
};

export const Sandbox = () => (
  <TimePickerBase
    value={text('value', '10:10')}
    onChange={action('onChange')}
  />
);
