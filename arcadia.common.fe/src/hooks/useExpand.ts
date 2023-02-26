import { useCallback, useState } from 'react';

interface IUseExpandOptions {
  isMulti?: boolean
}

export const useExpand = <TId = number | string>(options?: IUseExpandOptions) => {
  const { isMulti = true } = options || {} as IUseExpandOptions;
  const [expandedIds, setExpandedIds] = useState<TId[]>([]);

  const handleExpand = useCallback((id: TId) => {
    let newExpandedIds = [...expandedIds];

    if (!isMulti) {
      if (expandedIds.indexOf(id) !== -1) {
        newExpandedIds = [];
      } else {
        newExpandedIds = [id];
      }
    } else if (expandedIds.indexOf(id) !== -1) {
      newExpandedIds = expandedIds.filter((item: TId) => item !== id);
    } else {
      newExpandedIds.push(id);
    }

    setExpandedIds(newExpandedIds);
  }, [expandedIds, setExpandedIds, isMulti]);

  const handleResetExpand = useCallback(() => {
    setExpandedIds([]);
  }, [setExpandedIds]);

  const isExpanded = useCallback((id: TId) => (
    expandedIds.indexOf(id) !== -1
  ), [expandedIds]);

  return {
    expandedIds,
    isExpanded,
    handleExpand,
    handleResetExpand,
  };
};
