import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { QueueStatus } from '../../modules/machines/types';
import { queueStatusLabelMap } from '../../modules/machines/constants';

const options: ISelectOptions<QueueStatus> = Object.values(QueueStatus).map((key) => (
  { value: key, label: queueStatusLabelMap[key] }
));

export const QueueStatusField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="queueStatus"
    label="Queue Status"
    isClearable
    isMulti
    options={options}
    {...props}
  />
);
