import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ButtonColor, DialogConfirmation, DialogSection, Form, PasswordField, TextField, VoucherStatus,
} from 'arcadia-common-fe';
import { vouchersReducerSelector, vouchersRevokeDialogSelector } from '../../state/selectors';
import { setVouchersRevokeDialog, vouchersRevoke } from '../../state/actions';
import './VouchersRevokeDialog.scss';

interface IVouchersRevokeDialogProps {
}

let submitForm = () => {};

export const VouchersRevokeDialog: React.FC<IVouchersRevokeDialogProps> = () => {
  const dispatch = useDispatch();
  const { selectedVouchers, entities } = useSelector(vouchersReducerSelector);
  const { isOpen, isLoading } = useSelector(vouchersRevokeDialogSelector);

  const handleFormSubmit = useCallback((data: {reason: string, password: string}) => {
    const pendingVouchers = selectedVouchers.filter((id) => entities[id].status === VoucherStatus.pending);

    dispatch(vouchersRevoke({
      ids: pendingVouchers,
      ...data,
    }));
  }, [selectedVouchers]);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setVouchersRevokeDialog());
  }, []);

  return (
    <DialogConfirmation
      className="vouchers-revoke-dialog"
      isOpen={isOpen}
      isLoading={isLoading}
      submitBtnColor={ButtonColor.quaternary}
      title="Revoke Voucher"
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form onSubmit={handleSubmit}>
              <DialogSection>
                <div className="vouchers-revoke-dialog__message">
                  Are you sure you want to revoke the voucher?
                </div>
                <div className="vouchers-revoke-dialog__group">
                  <div>Specify the reason</div>
                  <TextField name="reason" isRequired />
                </div>
              </DialogSection>
              <DialogSection>
                <PasswordField
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
