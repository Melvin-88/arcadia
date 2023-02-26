import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { SessionStatus } from '../../modules/sessions/types';
import { sessionsLabelMap } from '../../modules/sessions/constants';

const options: ISelectOptions<SessionStatus> = Object.values(SessionStatus).map((key) => (
  { value: key, label: sessionsLabelMap[key] }
));

export const SessionsStatusField: React.FC<IFormFieldProps> = ({ className }) => (
  <Select
    className={className}
    name="status"
    label="Status"
    isClearable
    isMulti
    options={options}
  />
);
