import { useMemo } from 'react';
import queryString, { ParseOptions } from 'query-string';
import { useLocation } from 'react-router-dom';

export const useSearchParams = (queryStringOptions: ParseOptions = {
  parseNumbers: false,
}) => {
  const { search } = useLocation();

  return useMemo(() => (
    queryString.parse(search, queryStringOptions)
  ), [search]);
};
