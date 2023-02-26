import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType, ISelectEntityByTypeProps } from '../../modules/selectEntityByType/SelectEntityByType';

interface IDenominatorFieldProps extends IFormFieldProps, Partial<ISelectEntityByTypeProps>{
}

export const DenominatorField: React.FC<IDenominatorFieldProps> = (props) => (
  <SelectEntityByType
    name="denominator"
    label="Denominator"
    isMulti
    entityType={EntityType.denominator}
    {...props}
  />
);
