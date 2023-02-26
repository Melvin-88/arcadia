import React, { useMemo } from 'react';
import {
  Select, IFormFieldProps, ISelectProps, BinaryBoolean, createRequiredValidator,
} from 'arcadia-common-fe';

const options = [
  { label: 'New players', value: BinaryBoolean.true },
  { label: 'All players', value: BinaryBoolean.false },
];

interface INewPlayersOnlyFieldProps extends IFormFieldProps, Partial<ISelectProps> {
}

export const NewPlayersOnlyField: React.FC<INewPlayersOnlyFieldProps> = ({
  className,
  name = 'newPlayersOnly',
  label = 'Players',
  isRequired = true,
  ...restProps
}) => {
  const validator = useMemo(() => (
    isRequired ? createRequiredValidator(label) : () => undefined
  ), [label]);

  return (
    <Select
      className={className}
      name={name}
      label={label}
      isClearable={false}
      options={options}
      validate={validator}
      {...restProps}
    />
  );
};
