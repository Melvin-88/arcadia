import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType, ISelectEntityByTypeProps } from '../../modules/selectEntityByType/SelectEntityByType';

interface IGroupPrizesFieldProps extends IFormFieldProps, Partial<ISelectEntityByTypeProps> {
}

export const GroupPrizesField: React.FC<IGroupPrizesFieldProps> = ({
  name = 'prizeGroup',
  label = 'Group Prizes',
  ...restProps
}) => (
  <SelectEntityByType
    name={name}
    label={label}
    entityType={EntityType.prizeGroup}
    {...restProps}
  />
);
