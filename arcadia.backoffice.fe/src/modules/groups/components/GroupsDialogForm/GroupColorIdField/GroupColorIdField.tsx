import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { GroupColorId } from '../../../types';
import { groupColorIdLabelMap } from '../../../constants';

const options: ISelectOptions<GroupColorId> = Object.values(GroupColorId).map((key) => (
  { value: key, label: groupColorIdLabelMap[key] }
));

export const GroupColorIdField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="color"
    label="Color"
    isClearable
    options={options}
    {...props}
  />
);
