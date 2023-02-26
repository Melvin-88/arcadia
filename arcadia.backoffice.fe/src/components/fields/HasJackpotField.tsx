import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { BooleanField } from './common/BooleanField';

export const HasJackpotField: React.FC<IFormFieldProps> = (props) => (
  <BooleanField
    name="hasJackpot"
    label="Has Jackpot"
    {...props}
  />
);
