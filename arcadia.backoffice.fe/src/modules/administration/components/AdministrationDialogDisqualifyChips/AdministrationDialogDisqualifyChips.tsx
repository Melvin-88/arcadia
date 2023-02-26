import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, PasswordField, DialogConfirmation, DialogSection,
} from 'arcadia-common-fe';
import { administrationDialogDisqualifyChipsSelector } from '../../state/selectors';
import { administrationDisqualifyChips, setAdministrationDialogDisqualifyChips } from '../../state/actions';
import { RFIDFromField } from '../../../../components/fields/RFIDFromField';
import { RFIDToField } from '../../../../components/fields/RFIDToField';
import './AdministrationDialogDisqualifyChips.scss';

interface IAdministrationDialogDisqualifyChipsProps {
}

let submitForm = () => {};

export const AdministrationDialogDisqualifyChips: React.FC<IAdministrationDialogDisqualifyChipsProps> = () => {
  const dispatch = useDispatch();
  const { isOpen, isLoading } = useSelector(administrationDialogDisqualifyChipsSelector);

  const handleFormSubmit = useCallback((data) => {
    dispatch(administrationDisqualifyChips(data));
  }, []);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setAdministrationDialogDisqualifyChips());
  }, []);

  return (
    <DialogConfirmation
      className="administration-disqualify-chips"
      isOpen={isOpen}
      isLoading={isLoading}
      title="Disqualify Chips"
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form onSubmit={handleSubmit}>
              <DialogSection className="administration-disqualify-chips__fields-groups">
                <div className="administration-disqualify-chips__fields-group">
                  <div className="administration-disqualify-chips__fields-container">
                    <div className="administration-disqualify-chips__field-label">
                      From RFID
                    </div>
                    <RFIDFromField className="administration-disqualify-chips__field" label="" />
                  </div>
                </div>

                <div className="administration-disqualify-chips__fields-group">
                  <div className="administration-disqualify-chips__fields-container">
                    <div className="administration-disqualify-chips__field-label">
                      To RFID
                    </div>
                    <RFIDToField className="administration-disqualify-chips__field" label="" />
                  </div>
                </div>
              </DialogSection>
              <DialogSection>
                <PasswordField
                  className="administration-disqualify-chips__password-field"
                  classNameInputContainer="administration-disqualify-chips__password-field-container"
                  classNameLabel="administration-disqualify-chips__password-field-label"
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
