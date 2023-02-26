import React, { useCallback, useMemo } from 'react';
import {
  Form,
  JSONEditorField,
  TextField,
  Accordion,
  PasswordField,
  useExpand,
  convertDataToJSON,
  DialogConfirmation,
  DialogSection,
  HintPopup,
} from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { groupDialogFormSelector } from '../../state/selectors';
import { postGroup, putGroup, setGroupsDialogForm } from '../../state/actions';
import { IGroup, IPostGroupRequestBody, IPutGroupRequestBody } from '../../types';
import { DenominatorTextField } from '../../../../components/fields/DenominatorTextField';
import { IsPrivateField } from '../../../../components/fields/IsPrivateField';
import { IdleTimeoutField } from '../../../../components/fields/IdleTimeoutField';
import { GraceTimeoutField } from '../../../../components/fields/GraceTimeoutField';
import { GroupNameField } from '../../../../components/fields/GroupNameField';
import { GroupColorIdField } from './GroupColorIdField/GroupColorIdField';
import { GroupPrizesField } from '../../../../components/fields/GroupPrizesField';
import { GroupConfigurationHint } from './GroupConfigurationHint/GroupConfigurationHint';
import './GroupsDialogForm.scss';

export interface IGroupsDialogFormProps {
}

let submitForm = () => {};

export const GroupsDialogForm: React.FC<IGroupsDialogFormProps> = () => {
  const dispatch = useDispatch();
  const {
    isOpen, isLoading, initialValues,
  } = useSelector(groupDialogFormSelector);
  const { handleExpand, isExpanded } = useExpand({ isMulti: false });
  const isEdit = !!(initialValues && initialValues.id);

  const initialFormValues = useMemo(() => {
    const values = { ...initialValues } as (IGroup & { password: string });

    values.regulation = convertDataToJSON(initialValues?.regulation);
    values.configuration = convertDataToJSON(initialValues?.configuration);

    return values;
  }, [initialValues]);

  const handleFormSubmit = useCallback((values: IPostGroupRequestBody | IPutGroupRequestBody) => {
    const data = { ...values };

    if (data.regulation && typeof data.regulation !== 'object') {
      try {
        // @ts-ignore
        data.regulation = JSON.parse(data.regulation);
      } catch (error) {
        toast.error('Please make sure that regulation JSON is valid');

        return;
      }
    }

    if (data.configuration && typeof data.configuration !== 'object') {
      try {
        // @ts-ignore
        data.configuration = JSON.parse(data.configuration);
      } catch (error) {
        toast.error('Please make sure that configuration JSON is valid');

        return;
      }
    }

    if (isEdit) {
      dispatch(putGroup(data));
    } else {
      dispatch(postGroup(data));
    }
  }, [isEdit]);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setGroupsDialogForm());
  }, []);

  return (
    <DialogConfirmation
      isOpen={isOpen}
      isLoading={isLoading}
      title={`${isEdit ? 'Edit' : 'Add'} Group`}
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form className="groups-dialog-form" onSubmit={handleSubmit}>
              <DialogSection className="groups-dialog-form__fields-groups">
                <div className="groups-dialog-form__fields-group">
                  <div className="groups-dialog-form__field-container">
                    <div className="groups-dialog-form__field-label">
                      Group Name
                    </div>
                    <GroupNameField
                      className="groups-dialog-form__field"
                      name="name"
                      label=""
                      isRequired
                    />
                  </div>
                  <div className="groups-dialog-form__field-container">
                    <div className="groups-dialog-form__field-label">
                      Denominator
                    </div>
                    <DenominatorTextField className="groups-dialog-form__field" label="" />
                  </div>
                  <div className="groups-dialog-form__field-container">
                    <div className="groups-dialog-form__field-label">
                      Group prizes
                    </div>
                    <GroupPrizesField className="groups-dialog-form__field" label="" isRequired />
                  </div>
                  <div className="groups-dialog-form__field-container">
                    <div className="groups-dialog-form__field-label">
                      Blue ribbon game Id
                    </div>
                    <TextField className="groups-dialog-form__field" name="blueRibbonGameId" label="" />
                  </div>
                  <div className="groups-dialog-form__field-container">
                    <div className="groups-dialog-form__field-label">
                      Color Id
                    </div>
                    <GroupColorIdField className="groups-dialog-form__field" label="" />
                  </div>
                </div>

                <div className="groups-dialog-form__fields-group">
                  <div className="groups-dialog-form__field-container">
                    <div className="groups-dialog-form__field-label">
                      Idle timeout
                    </div>
                    <IdleTimeoutField className="groups-dialog-form__field" label="" />
                  </div>
                  <div className="groups-dialog-form__field-container">
                    <div className="groups-dialog-form__field-label">
                      Grace timeout
                    </div>
                    <GraceTimeoutField className="groups-dialog-form__field" label="" />
                  </div>
                  <div className="groups-dialog-form__field-container">
                    <div className="groups-dialog-form__field-label">
                      Stack buy limit
                    </div>
                    <TextField
                      className="groups-dialog-form__field"
                      name="stackBuyLimit"
                      type="number"
                      label=""
                      isRequired
                    />
                  </div>
                  <div className="groups-dialog-form__field-container">
                    <div className="groups-dialog-form__field-label">
                      Stack coins size
                    </div>
                    <TextField
                      className="groups-dialog-form__field"
                      name="stackCoinsSize"
                      type="number"
                      label=""
                      isRequired
                    />
                  </div>
                  <div className="groups-dialog-form__field-container">
                    <div className="groups-dialog-form__field-label">
                      Is Private
                    </div>
                    <IsPrivateField className="groups-dialog-form__field" label="" />
                  </div>
                </div>
              </DialogSection>
              <div className="groups-dialog-form__accordions-group">
                <Accordion
                  label="Regulation"
                  isExpanded={isExpanded('regulation')}
                  onChange={() => handleExpand('regulation')}
                >
                  <JSONEditorField
                    name="regulation"
                    placeholder="Regulation (JSON)"
                    height="150px"
                  />
                </Accordion>
                <Accordion
                  label={(
                    <div className="groups-dialog-form__accordion-label">
                      Configuration:&nbsp;
                      <HintPopup>
                        <GroupConfigurationHint />
                      </HintPopup>
                    </div>
                  )}
                  isExpanded={isExpanded('configuration')}
                  onChange={() => handleExpand('configuration')}
                >
                  <JSONEditorField
                    name="configuration"
                    placeholder="Configuration (JSON)"
                    height="150px"
                  />
                </Accordion>
              </div>
              <DialogSection>
                <PasswordField
                  className="groups-dialog-form__password-field"
                  classNameInputContainer="groups-dialog-form__password-field-container"
                  classNameLabel="groups-dialog-form__password-field-label"
                  label="You must confirm changes with your password"
                  withSymbolsValidation={false}
                />
              </DialogSection>
              <input type="submit" hidden />
            </form>
          );
        }}
      />
    </DialogConfirmation>
  );
};
