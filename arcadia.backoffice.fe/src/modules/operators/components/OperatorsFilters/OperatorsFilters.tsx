import React from 'react';
import { IModuleFiltersProps, ModuleFilters } from 'arcadia-common-fe';
import { OperatorNameField } from '../../../../components/fields/OperatorNameFilter';
import { OperatorsStatusField } from '../../../../components/fields/OperatorsStatusField';
import { IOperatorsFiltersPanelValues } from '../../types';

interface IOperatorsFiltersProps extends IModuleFiltersProps<IOperatorsFiltersPanelValues> {
}

export const OperatorsFilters: React.FC<IOperatorsFiltersProps> = (props) => (
  <ModuleFilters {...props}>
    <OperatorsStatusField />
    <OperatorNameField />
  </ModuleFilters>
);
