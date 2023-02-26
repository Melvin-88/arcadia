import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { BooleanField } from './common/BooleanField';

export const OperatorsField: React.FC<IFormFieldProps> = (props) => (
  <BooleanField
    name="operators"
    label="Operators"
    {...props}
  />
);
