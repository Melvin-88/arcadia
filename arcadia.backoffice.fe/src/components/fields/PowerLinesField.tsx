import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { ISelectEntityByTypeProps, SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface IPowerLinesFieldProps extends IFormFieldProps, Partial<ISelectEntityByTypeProps> {
  isRequired?: boolean
}

export const PowerLinesField: React.FC<IPowerLinesFieldProps> = ({
  name = 'powerLine',
  label = 'Power Line',
  ...restProps
}) => (
  <SelectEntityByType
    name={name}
    label={label}
    entityType={EntityType.powerLines}
    isMulti
    {...restProps}
  />
);
