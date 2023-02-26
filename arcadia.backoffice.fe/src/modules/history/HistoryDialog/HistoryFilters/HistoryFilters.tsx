import React, { useCallback, useRef } from 'react';
import {
  Button, ExportButton, Form, FormApi, DatepickerToField, DatepickerFromField,
} from 'arcadia-common-fe';
import './HistoryFilters.scss';

interface IHistoryFiltersProps<TValues> {
  total: number
  initialValues?: TValues
  isExporting?: boolean
  onFiltersSubmit: (data: TValues | {}) => void
  onExport: () => void
  onReset: () => void
}

let submitForm = () => {};

export const HistoryFilters: <TValues>(props: IHistoryFiltersProps<TValues>) => React.ReactElement = ({
  isExporting,
  total,
  initialValues,
  onExport,
  onFiltersSubmit,
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
          <div className="history-filters">
            <form onSubmit={handleSubmit}>
              <div className="history-filters__fields">
                <DatepickerFromField
                  label="Start Date"
                  name="startDate"
                  toName="endDate"
                />
                <DatepickerToField
                  label="End Date"
                  name="endDate"
                  fromName="startDate"
                />
              </div>
            </form>
            <div className="history-filters__controls">
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
