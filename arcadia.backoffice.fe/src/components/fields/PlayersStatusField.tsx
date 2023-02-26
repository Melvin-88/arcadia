import React from 'react';
import { ISelectOptions, Select, IFormFieldProps } from 'arcadia-common-fe';
import { PlayerStatus } from '../../modules/players/types';
import { playerStatusLabelMap } from '../../modules/players/constants';

const options: ISelectOptions<PlayerStatus> = Object.values(PlayerStatus).map((key) => (
  { value: key, label: playerStatusLabelMap[key] }
));

export const PlayersStatusField: React.FC<IFormFieldProps> = (props) => (
  <Select
    name="status"
    label="Status"
    isClearable
    isMulti
    options={options}
    {...props}
  />
);
