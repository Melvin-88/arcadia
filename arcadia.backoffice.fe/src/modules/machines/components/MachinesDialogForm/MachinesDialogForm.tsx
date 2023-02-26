import React, { useCallback } from 'react';
import {
  Form,
  JSONEditorField,
  TextField,
  Accordion,
  useExpand,
  convertDataToJSON,
  DialogConfirmation,
  DialogSection,
} from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { IMachine, IPostMachineRequestBody, IPutMachineRequestBody } from '../../types';
import { postMachine, putMachine, setMachinesDialogForm } from '../../state/actions';
import { machineDialogFormSelector } from '../../state/selectors';
import { SiteNameField } from '../../../../components/fields/SiteNameField';
import { GroupNameField } from '../../../../components/fields/GroupNameField';
import { IPField } from '../../../../components/fields/IPField';
import { PowerLinesField } from '../../../../components/fields/PowerLinesField';
import './MachinesDialogForm.scss';

export interface IGroupsDialogFormProps {
}

let submitForm = () => {};

export const MachinesDialogForm: React.FC<IGroupsDialogFormProps> = () => {
  const dispatch = useDispatch();
  const {
    isOpen, isLoading, initialValues,
  } = useSelector(machineDialogFormSelector);
  const isEdit = !!(initialValues && initialValues.id);
  const { handleExpand, isExpanded } = useExpand({ isMulti: false });

  const handleFormSubmit = useCallback((values: IPostMachineRequestBody | IPutMachineRequestBody) => {
    const data = { ...values };

    if (values.configuration) {
      try {
        // @ts-ignore
        data.configuration = JSON.parse(values.configuration);
      } catch (error) {
        toast.error('Please make sure that configuration JSON is valid');
      }
    }

    if (isEdit) {
      dispatch(putMachine(data));
    } else {
      dispatch(postMachine(data));
    }
  }, [isEdit]);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setMachinesDialogForm());
  }, []);

  return (
    <DialogConfirmation
      isOpen={isOpen}
      isLoading={isLoading}
      title={`${isEdit ? 'Edit' : 'Add'} Machine`}
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        initialValues={{
          ...initialValues,
          configuration: convertDataToJSON(initialValues?.configuration),
        } as (IMachine & { password: string, configuration: string })}
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form className="machines-dialog-form" onSubmit={handleSubmit}>
              <DialogSection className="machines-dialog-form__fields-groups">
                <div className="machines-dialog-form__fields-group">
                  <div className="machines-dialog-form__fields-container">
                    <div className="machines-dialog-form__field-label">
                      Machine name
                    </div>
                    <TextField className="machines-dialog-form__field" name="name" isRequired />
                  </div>
                  <div className="machines-dialog-form__fields-container">
                    <div className="machines-dialog-form__field-label">
                      Serial number
                    </div>
                    <TextField className="machines-dialog-form__field" name="serial" isRequired />
                  </div>
                  <div className="machines-dialog-form__fields-container">
                    <div className="machines-dialog-form__field-label">
                      Camera ID
                    </div>
                    <TextField className="machines-dialog-form__field" name="cameraID" isRequired />
                  </div>
                  <div className="machines-dialog-form__fields-container">
                    <div className="machines-dialog-form__field-label">
                      Location
                    </div>
                    <TextField className="machines-dialog-form__field" name="location" isRequired />
                  </div>
                </div>

                <div className="machines-dialog-form__fields-group">
                  <div className="machines-dialog-form__fields-container">
                    <div className="machines-dialog-form__field-label">
                      Robot controller IP
                    </div>
                    <IPField className="machines-dialog-form__field" name="controllerIP" isRequired label="" />
                  </div>
                  <div className="machines-dialog-form__fields-container">
                    <div className="machines-dialog-form__field-label">
                      Site
                    </div>
                    <SiteNameField className="machines-dialog-form__field" isRequired label="" isMulti={false} />
                  </div>
                  <div className="machines-dialog-form__fields-container">
                    <div className="machines-dialog-form__field-label">
                      Group
                    </div>
                    <GroupNameField
                      className="machines-dialog-form__field"
                      isMulti={false}
                      isRequired
                      controlType="select"
                      label=""
                      refreshOnMenuOpen
                    />
                  </div>
                  <div className="machines-dialog-form__fields-container">
                    <div className="machines-dialog-form__field-label">
                      Power Line
                    </div>
                    <PowerLinesField
                      className="machines-dialog-form__field"
                      isMulti={false}
                      isRequired
                      label=""
                    />
                  </div>
                </div>
                <Accordion
                  className="machines-dialog-form__accordion"
                  label="Configuration"
                  isExpanded={isExpanded('configuration')}
                  onChange={() => handleExpand('configuration')}
                >
                  <JSONEditorField
                    name="configuration"
                    placeholder="Configuration (JSON)"
                    height="150px"
                  />
                </Accordion>
              </DialogSection>
            </form>
          );
        }}
      />
    </DialogConfirmation>
  );
};
