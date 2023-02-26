import React from 'react';
import { TextField, IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType, ISelectEntityByTypeProps } from '../../modules/selectEntityByType/SelectEntityByType';

interface IGroupNameFieldProps extends IFormFieldProps, Partial<ISelectEntityByTypeProps> {
  controlType?: 'text' | 'select'
}

export const GroupNameField: React.FC<IGroupNameFieldProps> = ({
  controlType = 'text',
  name = 'groupName',
  label = 'Group Name',
  ...restProps
}) => {
  if (controlType === 'text') {
    return (
      <TextField
        name={name}
        label={label}
        {...restProps}
      />
    );
  }

  return (
    <SelectEntityByType
      name={name}
      label={label}
      isMulti
      entityType={EntityType.groupName}
      {...restProps}
    />
  );
};
