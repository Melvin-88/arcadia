import React from 'react';
import { IFormFieldProps } from 'arcadia-common-fe';
import { EntityType } from '../../modules/selectEntityByType/types';
import { ISelectEntityByTypeProps, SelectEntityByType } from '../../modules/selectEntityByType/SelectEntityByType';

interface ICamerasSiteNameFieldProps extends IFormFieldProps, Partial<ISelectEntityByTypeProps> {
  isRequired?: boolean
}

export const CamerasSiteNameField: React.FC<ICamerasSiteNameFieldProps> = ({
  name = 'siteName',
  label = 'Site',
  ...restProps
}) => (
  <SelectEntityByType
    name={name}
    label={label}
    entityType={EntityType.camerasSiteName}
    isMulti
    {...restProps}
  />
);
