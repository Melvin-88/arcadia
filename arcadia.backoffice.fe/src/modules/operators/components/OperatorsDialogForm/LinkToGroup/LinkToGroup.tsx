import React from 'react';
import { EntityType } from '../../../../selectEntityByType/types';
import { SelectEntityByType, ISelectEntityByTypeProps } from '../../../../selectEntityByType/SelectEntityByType';

interface ILinkToGroupProps extends Partial<ISelectEntityByTypeProps>{
}

export const LinkToGroup: React.FC<ILinkToGroupProps> = ({
  label = 'Link to groups',
  ...restProps
}) => (
  <SelectEntityByType
    name="linkToGroups"
    label={label}
    isMulti
    entityType={EntityType.groupId}
    {...restProps}
  />
);
