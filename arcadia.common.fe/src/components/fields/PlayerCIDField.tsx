import React from 'react';
import { IFormFieldProps } from '../../types';
import { TextField } from '../forms';

interface IPlayerCIDFieldProps extends IFormFieldProps {
  isRequired?: boolean
}

export const PlayerCIDField: React.FC<IPlayerCIDFieldProps> = ({
  className, name = 'playerCid', label = 'Player CID', ...restProps
}) => (
  <TextField
    className={className}
    name={name}
    label={label}
    {...restProps}
  />
);
