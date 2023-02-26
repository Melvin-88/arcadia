import React from 'react';
import { number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TableFooter } from 'arcadia-common-fe';

export default {
  component: TableFooter,
  title: 'TableFooter',
};

export const Sandbox = () => (
  <TableFooter
    selected={number('selected', 5)}
    itemsPerPage={number('itemsPerPage', 10)}
    total={number('total', 10)}
    paginationProps={{
      pageCount: number('pageCount', 8),
      onPageChange: action('onPageChange'),
    }}
  />
);
