import React, { useCallback } from 'react';
import {
  Form, TextField, DialogConfirmation, DialogSection,
} from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import { camerasDialogFormSelector } from '../../state/selectors';
import { IPostCamera } from '../../types';
import { postCamera, setCameraDialogForm } from '../../state/actions';
import { IPField } from '../../../../components/fields/IPField';
import './CamerasDialogForm.scss';

export interface ICameraDialogFormProps {
  site?: null | string
}

let submitForm = () => {};

export const CamerasDialogForm: React.FC<ICameraDialogFormProps> = ({ site }) => {
  const dispatch = useDispatch();
  const {
    isOpen, isLoading,
  } = useSelector(camerasDialogFormSelector);

  const handleFormSubmit = useCallback((values: IPostCamera) => {
    if (site) {
      dispatch(postCamera({
        site,
        camera: values,
      }));
    }
  }, [site]);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setCameraDialogForm());
  }, []);

  return (
    <DialogConfirmation
      isOpen={isOpen}
      isLoading={isLoading}
      title="Add Camera"
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form onSubmit={handleSubmit}>
              <DialogSection className="cameras-dialog-form__fields-groups">
                <div className="cameras-dialog-form__fields-group">
                  <div className="cameras-dialog-form__field-container">
                    <div className="cameras-dialog-form__field-label">
                      Camera ID
                    </div>
                    <TextField name="id" isRequired className="cameras-dialog-form__field" />
                  </div>
                  <div className="cameras-dialog-form__field-container">
                    <div className="cameras-dialog-form__field-label">
                      Camera Type
                    </div>
                    <TextField name="type" isRequired className="cameras-dialog-form__field" />
                  </div>
                  <div className="cameras-dialog-form__field-container">
                    <div className="cameras-dialog-form__field-label">
                      Camera IP
                    </div>
                    <IPField name="ip" isRequired className="cameras-dialog-form__field" label="" />
                  </div>
                  <div className="cameras-dialog-form__field-container">
                    <div className="cameras-dialog-form__field-label">
                      Port
                    </div>
                    <TextField
                      className="cameras-dialog-form__field"
                      name="port"
                      type="number"
                      isRequired
                      label=""
                    />
                  </div>
                  <div className="cameras-dialog-form__field-container">
                    <div className="cameras-dialog-form__field-label">
                      Admin port
                    </div>
                    <TextField
                      className="cameras-dialog-form__field"
                      name="adminPort"
                      type="number"
                      isRequired
                      label=""
                    />
                  </div>
                </div>

                <div className="cameras-dialog-form__fields-group">
                  <div className="cameras-dialog-form__field-container">
                    <div className="cameras-dialog-form__field-label">
                      Admin console URL
                    </div>
                    <TextField name="adminUrl" isRequired className="cameras-dialog-form__field" />
                  </div>
                  <div className="cameras-dialog-form__field-container">
                    <div className="cameras-dialog-form__field-label">
                      Admin username
                    </div>
                    <TextField name="adminUser" isRequired className="cameras-dialog-form__field" />
                  </div>
                  <div className="cameras-dialog-form__field-container">
                    <div className="cameras-dialog-form__field-label">
                      Admin password
                    </div>
                    <TextField name="adminPassword" isRequired className="cameras-dialog-form__field" />
                  </div>
                </div>
              </DialogSection>
            </form>
          );
        }}
      />
    </DialogConfirmation>
  );
};
