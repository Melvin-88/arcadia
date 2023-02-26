import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IFormFieldProps, Select, ISelectOption, TextField,
} from 'arcadia-common-fe';
import { segmentSubsetSelector } from '../../state/selectors';
import { getSegmentSubset } from '../../state/actions';
import { Segment } from '../../types';

interface MonitoringSegmentSubsetFilter extends IFormFieldProps {
  isRequired?: boolean
  isMulti?: boolean
  formValues?: {
    segment?: Segment | Segment[]
  }
}

export const MonitoringSegmentSubsetFilter: React.FC<MonitoringSegmentSubsetFilter> = ({
  className,
  isMulti = true,
  label = 'Segment Subset',
  formValues = {},
  ...restProps
}) => {
  const { segment } = formValues;
  const dispatch = useDispatch();
  const {
    isLoading, machines, groups, operators,
  } = useSelector(segmentSubsetSelector);

  const options = useMemo(() => {
    let optionsData: ISelectOption[] = [];

    if (machines && segment?.includes(Segment.machine)) {
      optionsData = [...optionsData, ...machines];
    }

    if (groups && segment?.includes(Segment.group)) {
      optionsData = [...optionsData, ...groups];
    }

    if (operators && segment?.includes(Segment.operator)) {
      optionsData = [...optionsData, ...operators];
    }

    return optionsData;
  }, [segment, machines, groups, operators]);

  const isDisabled = segment === Segment.all;

  useEffect(() => {
    dispatch(getSegmentSubset());
  }, []);

  return segment === Segment.machine ? (
    <TextField
      name="segmentSubset"
      label={label}
    />
  ) : (
    <Select
      {...restProps}
      className={className}
      isDisabled={isDisabled}
      name="segmentSubset"
      label={label}
      isClearable
      isMulti={isMulti}
      isLoading={isLoading}
      options={options}
    />
  );
};
