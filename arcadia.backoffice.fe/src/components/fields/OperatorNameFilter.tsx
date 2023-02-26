import React from 'react';
import { ISelectProps, IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface IOperatorNameFieldProps extends IFormFieldProps, Partial<ISelectProps> {
  isRequired?: boolean
}

export const OperatorNameField: React.FC<IOperatorNameFieldProps> = ({ className, label = 'Operator Name', ...restProps }) => (
  <SelectEntityByType
    className={className}
    name="operatorName"
    label={label}
    isMulti
    entityType={EntityType.operatorName}
    {...restProps}
  />
);
