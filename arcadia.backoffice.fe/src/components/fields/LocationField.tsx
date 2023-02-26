import React, { useMemo } from 'react';
import { createRequiredValidator, IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface ILocationFieldProps extends IFormFieldProps {
}

export const LocationField: React.FC<ILocationFieldProps> = ({ label = 'Location', ...restProps }) => {
  const validator = useMemo(() => (
    createRequiredValidator(label)
  ), [label]);

  return (
    <SelectEntityByType
      name="location"
      label={label}
      entityType={EntityType.location}
      validate={validator}
      {...restProps}
    />
  );
};
