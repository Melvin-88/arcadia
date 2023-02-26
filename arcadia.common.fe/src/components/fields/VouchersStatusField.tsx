import React from 'react';
import { ISelectOptions } from '../inputs';
import { IFormFieldProps, VoucherStatus } from '../../types';
import { Select } from '../forms';
import { voucherStatusLabelMap } from '../../constants';

const options: ISelectOptions<VoucherStatus> = Object.values(VoucherStatus).map((key) => (
  { value: key, label: voucherStatusLabelMap[key] }
));

export const VouchersStatusField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="status"
    label="Status"
    isClearable
    isMulti
    options={options}
    {...props}
  />
);
