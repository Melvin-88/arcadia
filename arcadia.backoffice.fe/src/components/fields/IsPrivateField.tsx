import React from 'react';
import { Checkbox, ITextFieldProps } from 'arcadia-common-fe';

interface IIsPrivateFieldProps extends Omit<ITextFieldProps, 'name'> {
  name?: string
}

export const IsPrivateField: React.FC<IIsPrivateFieldProps> = ({ label = 'Is Private', ...restProps }) => (
  <Checkbox
    name="isPrivate"
    label={label}
    {...restProps}
  />
);
