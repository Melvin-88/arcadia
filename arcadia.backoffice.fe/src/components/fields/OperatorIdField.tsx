import React from 'react';
import { ISelectProps, IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface IOperatorIdFieldProps extends IFormFieldProps, Partial<ISelectProps> {
  isRequired?: boolean
}

export const OperatorIdField: React.FC<IOperatorIdFieldProps> = ({
  className,
  label = 'Operator ID',
  name = 'operatorId',
  ...restProps
}) => (
  <SelectEntityByType
    className={className}
    name={name}
    label={label}
    isMulti
    entityType={EntityType.operatorId}
    {...restProps}
  />
);
