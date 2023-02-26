import React from 'react';
import { IFormFieldProps } from '../../types';
import { TextField } from '../forms';

export const UserNameField: React.FC<IFormFieldProps> = ({ className, name = 'userName' }) => (
  <TextField
    className={className}
    name={name}
    label="User Name"
  />
);
