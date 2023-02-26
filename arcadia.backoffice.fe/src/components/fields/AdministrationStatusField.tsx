import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { administrationStatusLabelMap } from '../../modules/administration/constants';
import { AdministrationUserStatus } from '../../modules/administration/types';

const options: ISelectOptions<AdministrationUserStatus> = Object.values(AdministrationUserStatus).map((key) => (
  { value: key, label: administrationStatusLabelMap[key] }
));

export const AdministrationStatusField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="status"
    label="Status"
    isClearable
    isMulti
    options={options}
    {...props}
  />
);
