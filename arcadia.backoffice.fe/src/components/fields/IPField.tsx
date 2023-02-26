import React from 'react';
import {
  ITextFieldProps, TextField, IFormFieldProps,
} from 'arcadia-common-fe';

const maskProps = {
  guide: false,
  mask: (value: string) => {
    const mask = Array(value.length).fill(/[\d.]/);
    const chunks = value.split('.');

    for (let i = 0; i < 4; i += 1) {
      const chunk = (chunks[i] || '');

      if (255 % +chunk === 255) {
        mask[value.length - 1] = '.';
        mask[value.length] = /[\d.]/;
      }
    }

    return mask;
  },
  pipe: (value: string) => {
    if (value === '.' || value.endsWith('..')) return false;

    const parts = value.split('.');

    if (
      parts.length > 4
      || parts.some((part: string) => part === '00' || +part < 0 || +part > 255)
    ) {
      return false;
    }

    return value;
  },
};

interface IIPFieldProps extends Partial<ITextFieldProps>, IFormFieldProps {
}

export const IPField: React.FC<IIPFieldProps> = ({
  name = 'ip',
  label = 'IP',
  ...restProps
}) => (
  <TextField
    name={name}
    label={label}
    {...restProps}
    {...maskProps}
  />
);
