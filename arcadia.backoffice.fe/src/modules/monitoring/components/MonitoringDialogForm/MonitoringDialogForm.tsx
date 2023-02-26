import React, {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import {
  Form, TextField, PasswordField, DialogConfirmation, DialogSection, OnFormChange,
} from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import { monitoringDialogFormSelector } from '../../state/selectors';
import { IPostMonitoringRequestBody, IPutMonitoringRequestBody } from '../../types';
import { putMonitoring, setMonitoringDialogForm, postMonitoring } from '../../state/actions';
import { MonitoringStatusField } from '../../../../components/fields/MonitoringStatusField';
import { MonitoringSegmentField } from '../../../../components/fields/MonitoringSegmentField';
import { MonitoringSegmentSubsetFilter } from '../MonitoringSegmentSubsetFilter/MonitoringSegmentSubsetFilter';
import { MonitoringModeField } from '../../../../components/fields/MonitoringModeField';
import { MonitoringMetricField } from '../../../../components/fields/MonitoringMetricField';
import { MonitoringDimensionField } from '../../../../components/fields/MonitoringDimensionField';
import { groupFormSubsets, initialSegmentSubset } from '../../helpers';
import './MonitoringDialogForm.scss';

export interface IMonitoringDialogFormProps {
}

interface IFormValues extends Omit<IPostMonitoringRequestBody | IPutMonitoringRequestBody, 'segmentSubset'>{
  segmentSubset: string
}

let submitForm = () => {};
let changeFormField: any;

export const MonitoringDialogForm: React.FC<IMonitoringDialogFormProps> = () => {
  const clearSegmentSubsetTimeoutRef = useRef<number | null>(null);
  const dispatch = useDispatch();
  const {
    isOpen, isLoading, initialValues,
  } = useSelector(monitoringDialogFormSelector);

  const isEdit = !!(initialValues && initialValues.id);

  const handleFormSubmit = useCallback((values: IFormValues) => {
    const newValues = { ...values };
    const requestData: IPostMonitoringRequestBody | IPutMonitoringRequestBody = {
      ...newValues,
      segmentSubset: groupFormSubsets(values.segmentSubset),
    };

    if (isEdit) {
      dispatch(putMonitoring(requestData));
    } else {
      dispatch(postMonitoring(requestData));
    }
  }, [isEdit]);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setMonitoringDialogForm());
  }, []);

  const handleClearSegmentSubset = useCallback(() => {
    // This setTimeout helps us to switch between SelectField and TextField.
    // When changing the select to an input, we must wait until the element is rendered.
    // Otherwise, do not apply the value in the field segmentSubset
    clearSegmentSubsetTimeoutRef.current = window.setTimeout(() => {
      changeFormField('segmentSubset', undefined);
    }, 0);
  }, []);

  const initialValuesForm = useMemo(() => ({
    ...initialValues,
    segmentSubset: initialSegmentSubset(initialValues?.segmentSubset),
  }), [initialValues]);

  useEffect(() => () => {
    if (clearSegmentSubsetTimeoutRef.current) {
      clearInterval(clearSegmentSubsetTimeoutRef.current);
    }
  }, [clearSegmentSubsetTimeoutRef.current]);

  return (
    <DialogConfirmation
      isOpen={isOpen}
      isLoading={isLoading}
      title={`${isEdit ? 'Edit' : 'Add'} Monitoring`}
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        initialValues={initialValuesForm}
        onSubmit={handleFormSubmit}
        render={({ handleSubmit, values, form }) => {
          submitForm = handleSubmit;
          changeFormField = form.change;

          return (
            <form onSubmit={handleSubmit}>
              <OnFormChange name="segment">
                {(value, previous) => {
                  if (value !== previous) {
                    handleClearSegmentSubset();
                  }
                }}
              </OnFormChange>
              <DialogSection className="monitoring-dialog-form__fields-groups">
                <div className="monitoring-dialog-form__fields-group">
                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Status
                    </div>
                    <MonitoringStatusField className="monitoring-dialog-form__field" isRequired label="" />
                  </div>

                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Segment
                    </div>
                    <MonitoringSegmentField
                      className="monitoring-dialog-form__field"
                      isMulti={false}
                      isRequired
                      label=""
                    />
                  </div>

                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Segment subset
                    </div>
                    <MonitoringSegmentSubsetFilter
                      className="monitoring-dialog-form__field"
                      formValues={values}
                      isMulti={false}
                      label=""
                    />
                  </div>

                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Mode
                    </div>
                    <MonitoringModeField className="monitoring-dialog-form__field" isRequired label="" />
                  </div>

                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Metric
                    </div>
                    <MonitoringMetricField className="monitoring-dialog-form__field" isRequired label="" />
                  </div>

                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Dimension
                    </div>
                    <MonitoringDimensionField className="monitoring-dialog-form__field" isRequired label="" />
                  </div>
                </div>

                <div className="monitoring-dialog-form__fields-group">
                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Target value
                    </div>
                    <TextField
                      className="monitoring-dialog-form__field"
                      name="targetValue"
                      type="number"
                      isRequired
                    />
                  </div>

                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Alert LT From
                    </div>
                    <TextField
                      className="monitoring-dialog-form__field"
                      name="alertLowThreshold"
                      type="number"
                    />
                  </div>

                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Alert HT To
                    </div>
                    <TextField
                      className="monitoring-dialog-form__field"
                      name="alertHighThreshold"
                      type="number"
                    />
                  </div>

                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Cutoff LT From
                    </div>
                    <TextField
                      className="monitoring-dialog-form__field"
                      name="cutoffLowThreshold"
                      type="number"
                    />
                  </div>

                  <div className="monitoring-dialog-form__fields-container">
                    <div className="monitoring-dialog-form__field-label">
                      Cutoff HT To
                    </div>
                    <TextField
                      className="monitoring-dialog-form__field"
                      name="cutoffHighThreshold"
                      type="number"
                    />
                  </div>
                </div>
              </DialogSection>
              <DialogSection>
                <PasswordField
                  className="monitoring-dialog-form__password-field"
                  classNameInputContainer="monitoring-dialog-form__password-field-container"
                  label="You must confirm changes with your password"
                  withSymbolsValidation={false}
                />
              </DialogSection>
            </form>
          );
        }}
      />
    </DialogConfirmation>
  );
};
