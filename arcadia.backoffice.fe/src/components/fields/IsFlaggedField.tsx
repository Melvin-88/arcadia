import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { BooleanField } from './common/BooleanField';

export const IsFlaggedField: React.FC<IFormFieldProps> = (props) => (
  <BooleanField
    name="isFlagged"
    label="Flagged"
    {...props}
  />
);
