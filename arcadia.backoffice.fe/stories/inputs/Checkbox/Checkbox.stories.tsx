import React from 'react';
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { CheckboxBase } from 'arcadia-common-fe';

export default {
  component: CheckboxBase,
  title: 'Checkbox',
};

export const Sandbox = () => (
  <CheckboxBase
    className={text('className', '')}
    value={boolean('value', true)}
    disabled={boolean('disabled', false)}
    label={text('label', 'I agree license agreement')}
    onChange={action('onChange')}
  />
);
