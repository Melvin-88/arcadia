import React, { useCallback } from 'react';
import {
  ISelectOptions, Select, IFormFieldProps, ISelectProps,
} from 'arcadia-common-fe';

export enum DisputesReportState {
  open = 'open',
  close = 'close',
}

interface IDisputesReportStateFieldProps extends IFormFieldProps, Partial<ISelectProps> {
}

const options: ISelectOptions = [
  { label: 'Open', value: DisputesReportState.open },
  { label: 'Close', value: DisputesReportState.close },
];

export const DisputesReportStateField: React.FC<IDisputesReportStateFieldProps> = (props) => {
  const handleFormat = useCallback((value) => {
    if (value === undefined) {
      return value;
    }

    return String(value);
  }, []);

  return (
    <Select
      isClearable
      name="filterByDate"
      options={options}
      format={handleFormat}
      {...props}
    />
  );
};
