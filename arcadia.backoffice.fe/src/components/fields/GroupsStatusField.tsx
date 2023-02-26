import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { GroupStatus } from '../../modules/groups/types';
import { groupStatusLabelMap } from '../../modules/groups/constants';

const options: ISelectOptions<GroupStatus> = Object.values(GroupStatus).map((key) => (
  { value: key, label: groupStatusLabelMap[key] }
));

export const GroupsStatusField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="status"
    label="Status"
    isClearable
    isMulti
    options={options}
    {...props}
  />
);
