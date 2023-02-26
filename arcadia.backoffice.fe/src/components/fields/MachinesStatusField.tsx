import React from 'react';
import {
  ISelectOptions, Select, IFormFieldProps,
} from 'arcadia-common-fe';
import { MachineStatus } from '../../modules/machines/types';
import { machineStatusLabelMap } from '../../modules/machines/constants';

interface IMachinesStatusFieldProps extends IFormFieldProps {
}

export const MachinesStatusField: React.FC<IMachinesStatusFieldProps> = (props) => {
// TODO: Should be removed after deleting Machine Status "inPlay"
  const options: ISelectOptions<MachineStatus> = Object.values(MachineStatus)
    .filter((status) => status !== MachineStatus.inPlay)
    .map((key) => ({ value: key, label: machineStatusLabelMap[key] }));

  return (
    <Select
      name="status"
      label="Machine Status"
      isClearable
      isMulti={false}
      options={options}
      {...props}
    />
  );
};
