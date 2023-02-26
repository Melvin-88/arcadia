import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, DateTimePickerFromField, DateTimePickerToField, convertDateTimeToSeconds, DialogConfirmation, DialogSection,
} from 'arcadia-common-fe';
import { camerasDialogGetRecordingSelector } from '../../../state/selectors';
import { getRecording, setGetRecordingDialog } from '../../../state/actions';
import './CameraDialogGetRecording.scss';

interface ICameraDialogGetRecordingProps {
  site: string
}

let submitForm = () => {};

export const CameraDialogGetRecording: React.FC<ICameraDialogGetRecordingProps> = ({ site }) => {
  const dispatch = useDispatch();
  const {
    isOpen, isLoading, id,
  } = useSelector(camerasDialogGetRecordingSelector);

  const handleFormSubmit = useCallback((data: { fromDateTime: number, toDateTime: number }) => {
    const processedData = { ...data };

    processedData.fromDateTime = convertDateTimeToSeconds(processedData.fromDateTime);
    processedData.toDateTime = convertDateTimeToSeconds(processedData.toDateTime);

    dispatch(getRecording({
      id,
      site,
      ...processedData,
    }));
  }, [id, site]);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setGetRecordingDialog());
  }, []);

  return (
    <DialogConfirmation
      className="camera-dialog-get-recording"
      isOpen={isOpen}
      isLoading={isLoading}
      title="Get Recording"
      submitText="Submit"
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form onSubmit={handleSubmit}>
              <DialogSection className="camera-dialog-get-recording__fields-groups">
                <div className="camera-dialog-get-recording__fields-container">
                  <div className="camera-dialog-get-recording__field-label">
                    From Date Time
                  </div>
                  <DateTimePickerFromField
                    name="fromDateTime"
                    toName="toDateTime"
                    maxDate={new Date()}
                    isRequired
                    popperModifiers={{
                      preventOverflow: {
                        enabled: false,
                      },
                    }}
                  />
                </div>

                <div className="camera-dialog-get-recording__fields-container">
                  <div className="camera-dialog-get-recording__field-label">
                    To Date Time
                  </div>
                  <DateTimePickerToField
                    name="toDateTime"
                    fromName="fromDateTime"
                    maxDate={new Date()}
                    isRequired
                    popperModifiers={{
                      preventOverflow: {
                        enabled: false,
                      },
                    }}
                  />
                </div>
              </DialogSection>
            </form>
          );
        }}
      />
    </DialogConfirmation>
  );
};
