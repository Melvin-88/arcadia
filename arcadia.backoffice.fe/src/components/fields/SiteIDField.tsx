import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { ISelectEntityByTypeProps, SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface ISiteNameFieldProps extends IFormFieldProps, Partial<ISelectEntityByTypeProps> {
  isRequired?: boolean
}

export const SiteIDField: React.FC<ISiteNameFieldProps> = ({
  className, isRequired, name = 'siteId', label = 'Site', ...restProps
}) => (
  <SelectEntityByType
    className={className}
    name={name}
    label={label}
    isRequired={isRequired}
    entityType={EntityType.siteId}
    isMulti
    {...restProps}
  />
);
