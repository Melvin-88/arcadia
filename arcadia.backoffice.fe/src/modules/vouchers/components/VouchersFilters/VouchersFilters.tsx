import React from 'react';
import {
  PlayerCIDField,
  VouchersStatusField,
  IModuleFiltersProps,
  ModuleFilters,
  DatepickerFromField,
  DatepickerToField,
  IVouchersFiltersPanelValues,
} from 'arcadia-common-fe';
import { IDField } from '../../../../components/fields/IDField';
import { GroupNameField } from '../../../../components/fields/GroupNameField';
import { OperatorNameField } from '../../../../components/fields/OperatorNameFilter';

interface IVouchersFiltersProps extends IModuleFiltersProps<IVouchersFiltersPanelValues> {
}

export const VouchersFilters: React.FC<IVouchersFiltersProps> = (props) => (
  <ModuleFilters {...props}>
    <VouchersStatusField />
    <IDField label="Voucher ID" />
    <OperatorNameField />
    <PlayerCIDField />
    <GroupNameField controlType="select" />
    <DatepickerFromField
      label="Granted From"
      name="grantedDateFrom"
      toName="grantedDateTo"
    />
    <DatepickerToField
      label="Granted To"
      name="grantedDateTo"
      fromName="grantedDateFrom"
    />
    <DatepickerFromField
      label="Expiration From"
      name="expirationDateFrom"
      toName="expirationDateTo"
    />
    <DatepickerToField
      label="Expiration To"
      name="expirationDateTo"
      fromName="expirationDateFrom"
    />
  </ModuleFilters>
);
