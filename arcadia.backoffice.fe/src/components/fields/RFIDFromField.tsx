import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';

export const RFIDFromField: React.FC<IFormFieldProps> = ({ className, label = 'RFID From' }) => (
  <TextField
    className={className}
    name="fromRFID"
    label={label}
    isRequired
  />
);
