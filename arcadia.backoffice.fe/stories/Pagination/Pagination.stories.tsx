import React from 'react';
import { text, number } from '@storybook/addon-knobs';
import { Pagination } from 'arcadia-common-fe';

export default {
  component: Pagination,
  title: 'Pagination',
};

export const Sandbox = () => (
  <Pagination
    containerClassName={text('containerClassName', '')}
    pageCount={number('pageCount', 5)}
    pageRangeDisplayed={number('pageRangeDisplayed', 3)}
    marginPagesDisplayed={number('marginPagesDisplayed', 3)}
  />
);
