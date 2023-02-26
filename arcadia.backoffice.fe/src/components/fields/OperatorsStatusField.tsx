import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { OperatorStatus } from '../../modules/operators/types';
import { operatorStatusLabelMap } from '../../modules/operators/constants';

const options: ISelectOptions<OperatorStatus> = Object.values(OperatorStatus).map((key) => (
  { value: key, label: operatorStatusLabelMap[key] }
));

export const OperatorsStatusField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="status"
    label="Status"
    isClearable
    isMulti
    options={options}
    {...props}
  />
);
