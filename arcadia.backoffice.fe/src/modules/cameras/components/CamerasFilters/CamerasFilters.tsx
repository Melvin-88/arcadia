import React from 'react';
import { IModuleFiltersProps, ModuleFilters } from 'arcadia-common-fe';
import { IDField } from '../../../../components/fields/IDField';
import { IGetCamerasRequestFiltersParams } from '../../types';
import { TypeField } from '../../../../components/fields/TypeField';
import { MachineNameField } from '../../../../components/fields/MachineNameField';
import { IPField } from '../../../../components/fields/IPField';

interface ICamerasFiltersProps extends IModuleFiltersProps<IGetCamerasRequestFiltersParams> {
}

export const CamerasFilters: React.FC<ICamerasFiltersProps> = (props) => (
  <ModuleFilters {...props}>
    <IDField label="Camera ID" />
    <TypeField name="type" type="text" />
    <IPField name="cameraIp" label="Camera IP" />
    <MachineNameField />
  </ModuleFilters>
);
