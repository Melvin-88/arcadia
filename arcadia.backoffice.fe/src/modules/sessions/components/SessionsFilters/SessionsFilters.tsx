import React, { useCallback } from 'react';
import {
  PlayerCIDField,
  IModuleFiltersProps,
  ModuleFilters,
  OnFormChange,
  FormSpy,
  DatepickerFromField,
  DatepickerToField,
  FormSpyRenderProps,
  dateSetEndOfTheDate,
  dateSubtractDays,
  dateSetZeroTimeOfTheDate,
} from 'arcadia-common-fe';
import { ISessionsFiltersPanelValues, SessionStatus } from '../../types';
import { IDField } from '../../../../components/fields/IDField';
import { MachineIDField } from '../../../../components/fields/MachineIDField';
import { DurationFromField } from '../../../../components/fields/DurationFromField';
import { DurationToField } from '../../../../components/fields/DurationToField';
import { RoundsFromField } from '../../../../components/fields/RoundsFromField';
import { RoundsToField } from '../../../../components/fields/RoundsToField';
import { TotalWinningFromField } from '../../../../components/fields/TotalWinningFromField';
import { TotalWinningToField } from '../../../../components/fields/TotalWinningToField';
import { TotalNetgamingFromField } from '../../../../components/fields/TotalNetgamingFromField';
import { TotalNetgamingToField } from '../../../../components/fields/TotalNetgamingToField';
import { SessionsStatusField } from '../../../../components/fields/SessionsStatusField';
import { GroupNameField } from '../../../../components/fields/GroupNameField';
import { OperatorNameField } from '../../../../components/fields/OperatorNameFilter';
import { IPField } from '../../../../components/fields/IPField';

interface ISessionsFilterProps extends IModuleFiltersProps<ISessionsFiltersPanelValues> {
}

export const SessionsFilters: React.FC<ISessionsFilterProps> = (props) => {
  const handleChangeStatus = useCallback(({ values, form }: FormSpyRenderProps) => {
    if (values?.status?.indexOf(SessionStatus.completed) !== -1 || values?.status?.indexOf(SessionStatus.terminated) !== -1) {
      if (!values?.startDateFrom) {
        const dateTo = dateSubtractDays(dateSetZeroTimeOfTheDate(new Date()), '6');
        const startDateFrom = dateTo.toISOString();

        form.change('startDateFrom', startDateFrom);
      }

      if (!values?.startDateTo) {
        const startDateTo = dateSetZeroTimeOfTheDate(new Date()).toISOString();

        form.change('startDateTo', startDateTo);
      }
    }
  }, []);

  return (
    <ModuleFilters {...props}>
      <FormSpy>
        {(propsFormSpy) => (
          <OnFormChange name="status">
            {(value, previous) => {
              if (value && value !== previous) {
                handleChangeStatus(propsFormSpy);
              }
            }}
          </OnFormChange>
        )}
      </FormSpy>
      <SessionsStatusField />
      <IDField label="Session ID" />
      <GroupNameField controlType="select" />
      <MachineIDField />
      <OperatorNameField />
      <PlayerCIDField />
      <DatepickerFromField
        label="Start Date From"
        name="startDateFrom"
        toName="startDateTo"
      />
      <DatepickerToField
        label="Start Date To"
        name="startDateTo"
        fromName="startDateFrom"
        maxDaysRange={7}
      />
      <DurationFromField />
      <DurationToField />
      <RoundsFromField />
      <RoundsToField />
      <TotalWinningFromField />
      <TotalWinningToField />
      <TotalNetgamingFromField />
      <TotalNetgamingToField />
      <IPField label="IP Address" />
    </ModuleFilters>
  );
};
