import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { AlertSeverity } from '../../types/alerts';
import { alertSeverityLabelMap } from '../../constants/alerts';

const options: ISelectOptions<AlertSeverity> = Object.values(AlertSeverity).map((key) => (
  { value: key, label: alertSeverityLabelMap[key] }
));

export const AlertsSeverityField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="severity"
    label="Severity"
    isClearable
    isMulti
    options={options}
    {...props}
  />
);
