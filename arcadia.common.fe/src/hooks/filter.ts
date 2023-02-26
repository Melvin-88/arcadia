import { useCallback } from 'react';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import { ICommonRequestFiltersParams } from '../types';

export function useHistoryPush<TValues>() {
  const history = useHistory();
  const { pathname } = useLocation();

  const handleHistoryPush = useCallback((searchParams: TValues) => {
    history.push(`${pathname}?${queryString.stringify(searchParams)}`);
  }, [pathname, history]);

  return {
    handleHistoryPush,
  };
}

export function useFilter<TValues extends ICommonRequestFiltersParams>() {
  const { handleHistoryPush } = useHistoryPush();

  const handleFiltersSubmit = useCallback((data: Partial<TValues>) => {
    const validSearchParams: Partial<TValues> = {};

    Object.keys(data).forEach((key) => {
      if (data[key]) {
        validSearchParams[key] = data[key];
      }
    });

    const newSearchParams = {
      ...validSearchParams,
      refreshTimestamp: Date.now(), // Refresh timestamp is needed to force update on each "Filters" submit
    };

    delete newSearchParams.take;
    delete newSearchParams.offset;

    handleHistoryPush(newSearchParams);
  }, [handleHistoryPush]);

  return {
    handleFiltersSubmit,
  };
}
