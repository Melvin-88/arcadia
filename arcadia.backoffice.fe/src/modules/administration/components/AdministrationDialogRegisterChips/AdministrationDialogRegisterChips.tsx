import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, PasswordField, DialogConfirmation, DialogSection,
} from 'arcadia-common-fe';
import { administrationDialogRegisterChipsSelector } from '../../state/selectors';
import { RFIDFromField } from '../../../../components/fields/RFIDFromField';
import { administrationRegisterChips, setAdministrationDialogRegisterChips } from '../../state/actions';
import { RegisterChipValueField } from '../../../../components/fields/RegisterChipValueField';
import { RFIDToField } from '../../../../components/fields/RFIDToField';
import { SiteIDField } from '../../../../components/fields/SiteIDField';
import { ChipTypeField } from '../../../../components/fields/ChipTypeField';
import './AdministrationDialogRegisterChips.scss';

interface IAdministrationDialogRegisterChipsProps {
}

let submitForm = () => {};

export const AdministrationDialogRegisterChips: React.FC<IAdministrationDialogRegisterChipsProps> = () => {
  const dispatch = useDispatch();
  const { isOpen, isLoading } = useSelector(administrationDialogRegisterChipsSelector);

  const handleFormSubmit = useCallback((data) => {
    dispatch(administrationRegisterChips(data));
  }, []);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setAdministrationDialogRegisterChips());
  }, []);

  return (
    <DialogConfirmation
      className="administration-register-chips"
      isOpen={isOpen}
      isLoading={isLoading}
      title="Register Chips"
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form onSubmit={handleSubmit}>
              <DialogSection className="administration-register-chips__fields-groups">
                <div className="administration-register-chips__fields-group">
                  <div className="administration-register-chips__fields-container">
                    <div className="administration-register-chips__field-label">
                      From RFID
                    </div>
                    <RFIDFromField className="administration-register-chips__field" label="" />
                  </div>
                  <div className="administration-register-chips__fields-container">
                    <div className="administration-register-chips__field-label">
                      To RFID
                    </div>
                    <RFIDToField className="administration-register-chips__field" label="" />
                  </div>
                  <div className="administration-register-chips__fields-container">
                    <div className="administration-register-chips__field-label">
                      Site
                    </div>
                    <SiteIDField className="administration-register-chips__field" isMulti={false} label="" />
                  </div>
                </div>

                <div className="administration-register-chips__fields-group">
                  <div className="administration-register-chips__fields-container">
                    <div className="administration-register-chips__field-label">
                      Chip Type
                    </div>
                    <ChipTypeField className="administration-register-chips__field" label="" />
                  </div>
                  <div className="administration-register-chips__fields-container">
                    <div className="administration-register-chips__field-label">
                      Value
                    </div>
                    <RegisterChipValueField className="administration-register-chips__field" label="" />
                  </div>
                </div>
              </DialogSection>
              <DialogSection>
                <PasswordField
                  className="administration-register-chips__password-field"
                  classNameInputContainer="administration-register-chips__password-field-container"
                  classNameLabel="administration-register-chips__password-field-label"
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
