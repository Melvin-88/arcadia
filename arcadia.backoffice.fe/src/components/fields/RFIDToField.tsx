import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const RFIDToField: React.FC<IFormFieldProps> = ({ className, label = 'RFID To' }) => (
  <TextField
    className={className}
    name="toRFID"
    label={label}
  />
);
