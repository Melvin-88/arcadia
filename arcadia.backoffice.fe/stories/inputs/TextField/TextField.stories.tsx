import React from 'react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TextFieldBase } from 'arcadia-common-fe';

export default {
  component: TextFieldBase,
  title: 'TextField',
};

export const Sandbox = () => (
  <TextFieldBase
    label={text('label', 'Email')}
    placeholder={text('placeholder', 'Email')}
    helperText={text('helperText', 'You will not be able to change it later')}
    error={text('error', '')}
    onChange={action('onChange')}
  />
);

export const DifferentStates = () => (
  <>
    <TextFieldBase label="Name" placeholder="Name" helperText="You will not be able to change it later" />
    <TextFieldBase label="Password" placeholder="Password" error="Password should be at least 6 characters" />
    <TextFieldBase label="Email" placeholder="Email" disabled />
  </>
);
