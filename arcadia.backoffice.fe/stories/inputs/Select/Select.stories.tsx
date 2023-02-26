import React, { useState } from 'react';
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SelectBase } from 'arcadia-common-fe';
import { options } from './constants';
import './Select.stories.scss';

export default {
  component: SelectBase,
  title: 'Select',
};

export const Sandbox = () => {
  const [value, setValue] = useState<string | string[] | undefined>('');
  const onChangeAction = action('onChange');

  return (
    <>
      <SelectBase
        className={text('className', '')}
        isMulti={boolean('isMulti', false)}
        isLoading={boolean('isLoading', false)}
        isDisabled={boolean('isDisabled', false)}
        isClearable={boolean('isClearable', true)}
        isSearchable={boolean('isSearchable', true)}
        label={text('label', 'State')}
        helperText={text('helperText', 'Please select state')}
        error={text('error', '')}
        options={options}
        value={value}
        dropdownWidthAuto={false}
        onChange={(newValue) => {
          setValue(newValue);
          onChangeAction(newValue);
        }}
      />
      <div className="select-story--small">
        <SelectBase
          className={text('className', '')}
          isMulti={boolean('isMulti', false)}
          isLoading={boolean('isLoading', false)}
          isDisabled={boolean('isDisabled', false)}
          isClearable={boolean('isClearable', true)}
          isSearchable={boolean('isSearchable', true)}
          label={text('label', 'State')}
          helperText={text('helperText', 'Please select state')}
          error={text('error', '')}
          options={options}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            onChangeAction(newValue);
          }}
        />
      </div>
    </>
  );
};
