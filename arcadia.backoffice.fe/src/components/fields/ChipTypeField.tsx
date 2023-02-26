import React from 'react';
import { ISelectProps, IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface IChipTypeFieldProps extends IFormFieldProps, Partial<ISelectProps> {
  isRequired?: boolean
}

export const ChipTypeField: React.FC<IChipTypeFieldProps> = ({ className, label = 'Chip Type', ...restProps }) => (
  <SelectEntityByType
    className={className}
    name="typeId"
    label={label}
    entityType={EntityType.chipType}
    {...restProps}
  />
);
