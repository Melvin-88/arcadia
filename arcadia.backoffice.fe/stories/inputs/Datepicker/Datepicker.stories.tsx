import React, { useState } from 'react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { DatepickerBase } from 'arcadia-common-fe';

export default {
  component: DatepickerBase,
  title: 'Datepicker',
};

export const Sandbox = () => {
  const [date, setDate] = useState<Date>(new Date());
  const onChangeAction = action('onChange');

  return (
    <DatepickerBase
      label={text('title', 'Date')}
      selected={date}
      onChange={(newDate:Date) => {
        setDate(newDate);
        onChangeAction(newDate);
      }}
    />
  );
};
