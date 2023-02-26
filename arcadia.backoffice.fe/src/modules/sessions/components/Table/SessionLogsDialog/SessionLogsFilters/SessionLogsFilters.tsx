import React, { useCallback, useRef } from 'react';
import {
  Button,
  ExportButton,
  Form,
  FormApi,
  DatepickerToField,
  DatepickerFromField,
  TextField,
} from 'arcadia-common-fe';
import { ParametersField } from '../../../../../../components/fields/ParametersField';
import { IGetLogsRequestFiltersParams } from '../../../../types';
import './SessionLogsFilters.scss';

interface ISessionLogsFiltersProps {
  initialValues?: IGetLogsRequestFiltersParams,
  total: number
  isExporting: boolean
  onFiltersSubmit: (data: IGetLogsRequestFiltersParams) => void
  onExport: () => void
  onReset: () => void
}

let submitForm = () => {};

export const SessionLogsFilters: React.FC<ISessionLogsFiltersProps> = ({
  initialValues,
  total,
  isExporting,
  onFiltersSubmit,
  onExport,
  onReset,
}) => {
  const formApiRef = useRef<FormApi | null>(null);
  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleReset = useCallback(() => {
    if (formApiRef.current) {
      formApiRef.current.reset({});
    }

    if (onReset) {
      onReset();
    }
  }, []);

  return (
    <Form
      onSubmit={onFiltersSubmit}
      initialValues={initialValues}
      render={({
        submitting,
        handleSubmit,
        form,
      }) => {
        formApiRef.current = form;
        submitForm = handleSubmit;

        return (
          <div className="session-logs-filters">
            <form className="session-logs-filters__form" onSubmit={handleSubmit}>
              <div className="session-logs-filters__fields">
                <DatepickerFromField
                  label="Date From"
                  name="dateFrom"
                  toName="dateTo"
                />
                <DatepickerToField
                  label="Date To"
                  name="dateTo"
                  fromName="dateFrom"
                />
                <TextField name="type" label="Type" />
                <ParametersField />
              </div>
            </form>
            <div className="session-logs-filters__controls">
              <Button
                color="tertiary"
                type="submit"
                disabled={submitting}
                onClick={handleSubmitClick}
              >
                Filter
              </Button>
              <Button
                color="primary"
                disabled={submitting}
                onClick={handleReset}
              >
                Reset
              </Button>
              <ExportButton
                disabled={total <= 0}
                isLoading={isExporting}
                onClick={onExport}
              />
            </div>
          </div>
        );
      }}
    />
  );
};
