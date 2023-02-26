import React, { useCallback } from 'react';
import { Select } from 'arcadia-common-fe';
import { BinaryBoolean } from '../../../types/api';

interface IBooleanFieldProps {
  name: string
  label: string
}

const options = [
  { label: 'Yes', value: BinaryBoolean.true },
  { label: 'No', value: BinaryBoolean.false },
];

export const BooleanField: React.FC<IBooleanFieldProps> = (props) => {
  const handleFormat = useCallback((value) => {
    if (value === undefined) {
      return value;
    }

    return String(value);
  }, []);

  return (
    <Select
      isClearable
      options={options}
      format={handleFormat}
      {...props}
    />
  );
};
