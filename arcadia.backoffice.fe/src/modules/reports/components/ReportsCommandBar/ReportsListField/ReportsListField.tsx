import React from 'react';
import { Select, IFormFieldProps, ISelectOptions } from 'arcadia-common-fe';
import { ReportType } from '../../../types';
import { reportsListLabelMap } from '../../../constants';

const options: ISelectOptions<ReportType> = Object.values(ReportType).map((key) => (
  { value: key, label: reportsListLabelMap[key] }
));

export const ReportsListField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="report"
    label=""
    options={options}
    {...props}
  />
);
