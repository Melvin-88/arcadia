import { useCallback } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { useSearchParams } from './searchParams';
import { ITEMS_PER_PAGE } from '../constants';
import { history } from '../routing';

export const usePagination = () => {
  const { pathname } = useLocation();
  const searchParams = useSearchParams();
  const offset = Number(searchParams.offset) || 0;
  const forcePage = offset / ITEMS_PER_PAGE || 0;

  const handlePageChange = useCallback(({ selected }) => {
    if (Number.isNaN(selected)) {
      return;
    }

    const newSearchParams = {
      ...searchParams,
      offset: selected * ITEMS_PER_PAGE,
    };

    history.push(`${pathname}?${queryString.stringify(newSearchParams)}`);
  }, [pathname, searchParams]);

  return {
    handlePageChange,
    forcePage,
    offset,
  };
};
