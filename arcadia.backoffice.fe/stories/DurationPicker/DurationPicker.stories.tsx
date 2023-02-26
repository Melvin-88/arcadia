import React from 'react';
import { DurationPickerBase } from 'arcadia-common-fe';
import { action } from '@storybook/addon-actions';
import { number } from '@storybook/addon-knobs';

export default {
  component: DurationPickerBase,
  title: 'DurationPicker',
};

export const Sandbox = () => (
  <DurationPickerBase
    value={number('value', 0)}
    onChange={action('onChange')}
  />
);
