import React from 'react';
import {
  IModuleFiltersProps, ModuleFilters, DatepickerFromField, DatepickerToField,
} from 'arcadia-common-fe';
import { IPlayersFiltersPanelValues } from '../../types';
import { PlayersStatusField } from '../../../../components/fields/PlayersStatusField';
import { OperatorNameField } from '../../../../components/fields/OperatorNameFilter';
import { IDField } from '../../../../components/fields/IDField';
import { BetsFromField } from '../../../../components/fields/BetsFromField';
import { BetsToField } from '../../../../components/fields/BetsToField';
import { WinsFromField } from '../../../../components/fields/WinsFromField';
import { WinsToField } from '../../../../components/fields/WinsToField';
import { NetgamingFromField } from '../../../../components/fields/NetgamingFromField';
import { NetgamingToField } from '../../../../components/fields/NetgamingToField';

interface IPlayersFiltersProps extends IModuleFiltersProps<IPlayersFiltersPanelValues> {
}

export const PlayersFilters: React.FC<IPlayersFiltersProps> = (props) => (
  <ModuleFilters {...props}>
    <PlayersStatusField />
    <OperatorNameField />
    <IDField name="cid" label="Player CID" />
    <BetsFromField />
    <BetsToField />
    <WinsFromField />
    <WinsToField />
    <NetgamingFromField />
    <NetgamingToField />
    <DatepickerFromField
      label="Created From"
      name="createdDateFrom"
      toName="createdDateTo"
    />
    <DatepickerToField
      label="Created To"
      name="createdDateTo"
      fromName="createdDateFrom"
    />
    <DatepickerFromField
      label="Last Session From"
      name="lastSessionDateFrom"
      toName="lastSessionDateTo"
    />
    <DatepickerToField
      label="Last Session To"
      name="lastSessionDateTo"
      fromName="lastSessionDateFrom"
    />
  </ModuleFilters>
);
