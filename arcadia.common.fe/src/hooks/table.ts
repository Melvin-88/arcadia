import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { history } from '../routing/history';
import { useSearchParams } from './searchParams';
import { ISortData, SortOrder } from '../types';

export const useTableSorting = (
  filterParams: { [key: string]: any },
  onSortAction: (params: { [key: string]: string | undefined }) => void,
) => {
  const onSort = useCallback((key: string) => {
    const { sortBy, sortOrder } = filterParams;
    let newSortBy = sortBy;
    let newSortOrder;

    if (sortBy !== key) {
      newSortBy = key;
      newSortOrder = SortOrder.asc;
    }

    if (sortBy === key) {
      if (sortOrder !== SortOrder.desc) {
        newSortOrder = SortOrder.desc;
      } else {
        newSortBy = undefined;
        newSortOrder = undefined;
      }
    }

    const newSearchParams = {
      ...filterParams,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    };

    onSortAction(newSearchParams);
  }, [filterParams, onSortAction]);

  return {
    onSort,
  };
};

export const useTableSortingWithRouting = () => {
  const { pathname } = useLocation();
  const searchParams: ISortData = useSearchParams();

  const handleSort = useCallback((newSearchParams) => {
    history.push(`${pathname}?${queryString.stringify(newSearchParams)}`);
  }, [pathname]);

  const { onSort } = useTableSorting(searchParams, handleSort);

  const createSortHandler = useCallback((key: string) => () => (
    onSort(key)
  ), [onSort]);

  return {
    createSortHandler,
    ...searchParams,
  };
};

export const useTableItemsSelection = <TValues = number>(
  selector: (state: any) => TValues[],
  setStoreAction: (ids: TValues[]) => void,
) => {
  const dispatch = useDispatch();
  const selectedItems = useSelector(selector);

  const isItemSelected = useCallback((id: TValues) => (
    selectedItems.some((item) => item === id)
  ), [selectedItems]);

  const isSelectedAll = useCallback((ids: TValues[]) => (
    selectedItems?.length === ids.length
  ), [selectedItems]);

  const handleSelectItem = useCallback((id: TValues) => {
    let newSelectedState: TValues[] = [...selectedItems];

    if (newSelectedState.some((item) => item === id)) {
      newSelectedState = newSelectedState.filter((item) => item !== id);
    } else {
      newSelectedState.push(id);
    }

    dispatch(setStoreAction(newSelectedState));
  }, [selectedItems]);

  const handleSelectAll = useCallback((ids: TValues[]) => {
    if (isSelectedAll(ids)) {
      dispatch(setStoreAction([]));
    } else {
      dispatch(setStoreAction(ids));
    }
  }, [dispatch, selectedItems, setStoreAction]);

  return {
    selectedItems,
    handleSelectItem,
    isItemSelected,
    handleSelectAll,
    isSelectedAll,
  };
};
