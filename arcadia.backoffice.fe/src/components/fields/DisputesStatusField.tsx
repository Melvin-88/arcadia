import React from 'react';
import {
  ISelectOptions, ISelectProps, Select, IFormFieldProps,
} from 'arcadia-common-fe';
import { DisputeStatus } from '../../modules/disputes/types';
import { disputeStatusLabelMap } from '../../modules/disputes/constants';

const options: ISelectOptions<DisputeStatus> = Object.values(DisputeStatus).map((key) => (
  { value: key, label: disputeStatusLabelMap[key] }
));

interface IDisputesStatusFieldProps extends IFormFieldProps, Partial<ISelectProps> {
  isRequired?: boolean
}

export const DisputesStatusField: React.FC<IDisputesStatusFieldProps> = (props) => (
  <Select
    name="status"
    label="Status"
    isClearable
    isMulti
    options={options}
    {...props}
  />
);
