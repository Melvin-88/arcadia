import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useSearchParams } from './searchParams';

export const useExport = (total: number, actionCreator: (filterParams: { [key: string]: any }) => void) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const handleExport = useCallback(() => {
    dispatch(actionCreator({
      ...searchParams,
      offset: 0,
      take: total,
    }));
  }, [total, searchParams]);

  return {
    handleExport,
  };
};
