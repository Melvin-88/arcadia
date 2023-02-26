import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { AlertStatus } from '../../modules/alerts/types';
import { alertStatusLabelMap } from '../../modules/alerts/constants';

const options: ISelectOptions<AlertStatus> = Object.values(AlertStatus).map((key) => (
  { value: key, label: alertStatusLabelMap[key] }
));

export const AlertsStatusField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="status"
    label="Status"
    isClearable
    isMulti
    options={options}
    {...props}
  />
);
