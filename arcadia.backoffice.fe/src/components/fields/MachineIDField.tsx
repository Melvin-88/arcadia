import React from 'react';
import { TextField, ITextFieldProps, IFormFieldProps } from 'arcadia-common-fe';

interface IMachineIDFieldProps extends IFormFieldProps, Partial<ITextFieldProps>{
}

export const MachineIDField: React.FC<IMachineIDFieldProps> = ({ className, ...restProps }) => (
  <TextField
    className={className}
    name="machineId"
    label="Machine ID"
    type="number"
    {...restProps}
  />
);
