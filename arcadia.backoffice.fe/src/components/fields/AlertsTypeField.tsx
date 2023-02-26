import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { AlertType } from '../../types/alerts';
import { alertTypeLabelMap } from '../../constants/alerts';

const options: ISelectOptions<AlertType> = Object.values(AlertType).map((key) => (
  { value: key, label: alertTypeLabelMap[key] }
));

export const AlertTypeField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="type"
    label="Alert Type"
    isClearable
    isMulti
    options={options}
    {...props}
  />
);
