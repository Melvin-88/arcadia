import React, { useCallback } from 'react';
import { composeValidators, createRequiredValidator, IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

export const RebateCurrencyField: React.FC<IFormFieldProps> = ({
  className, label = 'Rebate Currency', name = 'rebateCurrency', ...restProps
}) => {
  const validator = useCallback((value, values?: { rebateSum?: number }) => {
    if (values?.rebateSum) {
      return composeValidators(createRequiredValidator(label))(value, values);
    }

    return undefined;
  }, [label]);

  return (
    <SelectEntityByType
      className={className}
      isCreatable
      isSearchable
      name={name}
      label={label}
      entityType={EntityType.rebateCurrency}
      validate={validator}
      {...restProps}
    />
  );
};
