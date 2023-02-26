import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType, ISelectEntityByTypeProps } from '../../modules/selectEntityByType/SelectEntityByType';

interface IGroupIdFieldProps extends IFormFieldProps, Partial<ISelectEntityByTypeProps> {
}

export const GroupIdField: React.FC<IGroupIdFieldProps> = ({
  name = 'groupId',
  label = 'Group ID',
  ...restProps
}) => (
  <SelectEntityByType
    name={name}
    label={label}
    isMulti
    entityType={EntityType.groupId}
    {...restProps}
  />
);
