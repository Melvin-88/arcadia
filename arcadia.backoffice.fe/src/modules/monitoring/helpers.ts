import { IGroupFiltersSubsets, ISegmentSubset, SelectGroupIdPrefix } from './types';

export const addSelectGroupPrefix = (id: number, prefix: SelectGroupIdPrefix) => `${prefix}${id}`;

export const initialSegmentSubset = (data?: ISegmentSubset) => {
  let segmentSubset: undefined | string | number;

  if (!data) {
    return undefined;
  }

  if (data[SelectGroupIdPrefix.group]) {
    segmentSubset = `${SelectGroupIdPrefix.group}${data[SelectGroupIdPrefix.group]}`;
  } else if (data[SelectGroupIdPrefix.operator]) {
    segmentSubset = `${SelectGroupIdPrefix.operator}${data[SelectGroupIdPrefix.operator]}`;
  } else {
    segmentSubset = data[SelectGroupIdPrefix.machine];
  }

  return segmentSubset;
};

export const groupFormSubsets = (data?: string) => {
  const filters: ISegmentSubset = {};

  if (!data) {
    return filters;
  }

  const dataString = data.toString();

  if (dataString.indexOf(SelectGroupIdPrefix.group) !== -1) {
    filters.group = Number(data.replace(SelectGroupIdPrefix.group, ''));
  } else if (dataString.indexOf(SelectGroupIdPrefix.operator) !== -1) {
    filters.operator = Number(dataString.replace(SelectGroupIdPrefix.operator, ''));
  } else {
    filters.machine = Number(dataString.replace(SelectGroupIdPrefix.machine, ''));
  }

  return filters;
};

export const groupFiltersSubsets = (data: string) => {
  const filters: IGroupFiltersSubsets = {};
  const dataString = data.toString();

  if (dataString.indexOf(SelectGroupIdPrefix.group) !== -1) {
    filters.segmentSubsetGroup = data.toString().replace(SelectGroupIdPrefix.group, '');
  }
  if (dataString.indexOf(SelectGroupIdPrefix.machine) !== -1) {
    filters.segmentSubsetMachine = data.toString().replace(SelectGroupIdPrefix.machine, '');
  }
  if (dataString.indexOf(SelectGroupIdPrefix.operator) !== -1) {
    filters.segmentSubsetOperator = data.toString().replace(SelectGroupIdPrefix.operator, '');
  }

  return filters;
};

export const checkFiltersSubsets = (searchParams: { [key: string]: any }) => {
  const newParams = { ...searchParams };

  newParams.segmentSubset = [];

  Object.keys(newParams).forEach((key) => {
    if (key === 'segmentSubsetGroup') {
      if (Array.isArray(newParams[key])) {
        newParams[key].forEach((id: string) => {
          newParams.segmentSubset.push(addSelectGroupPrefix(Number(id), SelectGroupIdPrefix.group));
        });
      } else {
        newParams.segmentSubset.push(addSelectGroupPrefix(Number(newParams[key]), SelectGroupIdPrefix.group));
      }
      delete newParams.segmentSubsetGroup;
    }
    if (key === 'segmentSubsetMachine') {
      if (Array.isArray(newParams[key])) {
        newParams[key].forEach((id: string) => {
          newParams.segmentSubset.push(addSelectGroupPrefix(Number(id), SelectGroupIdPrefix.machine));
        });
      } else {
        newParams.segmentSubset.push(addSelectGroupPrefix(Number(newParams[key]), SelectGroupIdPrefix.machine));
      }
      delete newParams.segmentSubsetMachine;
    }
    if (key === 'segmentSubsetOperator') {
      if (Array.isArray(newParams[key])) {
        newParams[key].forEach((id: string) => {
          newParams.segmentSubset.push(addSelectGroupPrefix(Number(id), SelectGroupIdPrefix.operator));
        });
      } else {
        newParams.segmentSubset.push(addSelectGroupPrefix(Number(newParams[key]), SelectGroupIdPrefix.operator));
      }
      delete newParams.segmentSubsetOperator;
    }
  });

  return newParams;
};
