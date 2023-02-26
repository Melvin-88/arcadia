import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ISelectProps, Select, useDebounce } from 'arcadia-common-fe';
import { getEntityData } from './actions';
import { EntityType } from './types';
import { entitySelector } from './selectors';

export interface ISelectEntityByTypeProps extends Omit<ISelectProps, 'options'> {
  className?: string
  name: string
  label: string
  isMulti?: boolean
  entityType: EntityType
}

export const SelectEntityByType: React.FC<ISelectEntityByTypeProps> = ({
  entityType,
  isCreatable = true,
  ...restProps
}) => {
  const entities = useSelector(entitySelector);
  const entityData = entities[entityType] || {};
  const { options, isLoading } = entityData;
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 500);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEntityData({ entityType }));
  }, [entityType]);

  useEffect(() => {
    if (debouncedInputValue) {
      dispatch(getEntityData({ entityType }));
    }
  }, [entityType, debouncedInputValue]);

  const handleInputChange = useCallback((value: string) => {
    if (value) {
      setInputValue(value);
    }
  }, [setInputValue]);

  return (
    <Select
      isClearable={isCreatable}
      isLoading={isLoading}
      options={options || []}
      onInputChange={handleInputChange}
      {...restProps}
    />
  );
};
