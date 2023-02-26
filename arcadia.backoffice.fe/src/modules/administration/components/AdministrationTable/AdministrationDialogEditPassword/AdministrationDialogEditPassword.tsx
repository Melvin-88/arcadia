import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, ButtonColor, PasswordField, DialogSection, DialogConfirmation,
} from 'arcadia-common-fe';
import { administrationDialogEditPassword } from '../../../state/selectors';
import { setAdministrationDialogEditPassword, administrationEditPassword } from '../../../state/actions';
import { PasswordConfirmField } from '../../../../../components/fields/PasswordConfirmField';
import './AdministrationDialogEditPassword.scss';

let submitForm: () => void;

interface IAdministrationDialogEditPasswordProps {
}

export const AdministrationDialogEditPassword: React.FC<IAdministrationDialogEditPasswordProps> = () => {
  const {
    id, isOpen, isLoading,
  } = useSelector(administrationDialogEditPassword);
  const dispatch = useDispatch();

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setAdministrationDialogEditPassword());
  }, []);

  const handleSubmitForm = useCallback((data) => {
    dispatch(administrationEditPassword({
      ...data,
      id,
    }));
  }, [id]);

  return (
    <DialogConfirmation
      className="administration-dialog-edit"
      isOpen={isOpen}
      isLoading={isLoading}
      title="Edit Password"
      submitText="Save"
      submitBtnColor={ButtonColor.secondary}
      onSubmit={handleSubmitClick}
      onClose={handleClose}
    >
      <Form
        onSubmit={handleSubmitForm}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form onSubmit={handleSubmit}>
              <DialogSection>
                <div className="administration-dialog-edit-password__field">
                  <div className="administration-dialog-edit-password__field-label">Password</div>
                  <PasswordField
                    label=""
                    name="password"
                  />
                </div>
                <div className="administration-dialog-edit-password__field">
                  <div className="administration-dialog-edit-password__field-label">Confirm password</div>
                  <PasswordConfirmField
                    name="passwordConfirm"
                    placeholder="Password"
                    label=""
                  />
                </div>
              </DialogSection>
              <DialogSection>
                <div className="administration-dialog-edit-password__field">
                  <div className="administration-dialog-edit-password__field-label">You must confirm changes with your password</div>
                  <PasswordField
                    label=""
                    name="currentUsersPassword"
                    withSymbolsValidation={false}
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
