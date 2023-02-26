import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { ISelectEntityByTypeProps, SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface IMachineNameField extends IFormFieldProps, Partial<ISelectEntityByTypeProps> {
}

export const MachineNameField: React.FC<IMachineNameField> = ({
  className, name = 'machine', label = 'Machine', ...restProps
}) => (
  <SelectEntityByType
    className={className}
    name={name}
    label={label}
    entityType={EntityType.machineName}
    {...restProps}
  />
);
