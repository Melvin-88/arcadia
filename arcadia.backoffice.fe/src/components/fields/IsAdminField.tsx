import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { BooleanField } from './common/BooleanField';

export const IsAdminField: React.FC<IFormFieldProps> = (props) => (
  <BooleanField
    name="isAdmin"
    label="Is Admin"
    {...props}
  />
);
