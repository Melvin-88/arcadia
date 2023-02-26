import React, { useMemo } from 'react';
import { createRequiredValidator, IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { ISelectEntityByTypeProps, SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface IBlockingReasonFieldProps extends IFormFieldProps, Partial<ISelectEntityByTypeProps> {
  isRequired?: boolean
}

export const BlockingReasonField: React.FC<IBlockingReasonFieldProps> = ({
  className, isRequired, name = 'reason', label = 'Blocking Reason', ...restProps
}) => {
  const validator = useMemo(() => (
    isRequired ? createRequiredValidator('Blocking Reason') : () => undefined
  ), [label, name]);

  return (
    <SelectEntityByType
      className={className}
      isCreatable
      isSearchable
      name={name}
      label={label}
      entityType={EntityType.blockingReason}
      validate={validator}
      {...restProps}
    />
  );
};
