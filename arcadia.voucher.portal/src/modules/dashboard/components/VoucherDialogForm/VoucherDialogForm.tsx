import React, { useCallback } from 'react';
import {
  Form,
  TextField,
  DialogConfirmation,
  DialogSection,
  Datepicker,
  dateAddDays,
} from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import { voucherDialogFormSelector } from '../../state/selectors';
import { postVoucher, setVoucherDialogForm } from '../../state/actions';
import { IPostVoucherRequestBody } from '../../types';
import { GroupNameField } from '../../../../components/fields/GroupNameField';
import './VoucherDialogForm.scss';

export interface IVoucherDialogFormProps {
}

interface IFormValues extends Omit<IPostVoucherRequestBody, 'playerCid'> {
  playerCid: string
}

let submitForm = () => {};

export const VoucherDialogForm: React.FC<IVoucherDialogFormProps> = () => {
  const dispatch = useDispatch();
  const { isOpen, isLoading } = useSelector(voucherDialogFormSelector);

  const minDate = dateAddDays(new Date(), '1');

  const handleFormSubmit = useCallback((values: IFormValues) => {
    const newValues = { ...values };
    const requestData: IPostVoucherRequestBody = {
      ...newValues,
      playerCid: newValues.playerCid.split(','),
    };

    dispatch(postVoucher(requestData));
  }, []);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setVoucherDialogForm());
  }, []);

  return (
    <DialogConfirmation
      className="voucher-dialog-form"
      isOpen={isOpen}
      isLoading={isLoading}
      title="Add Voucher"
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
                <div className="voucher-dialog-form__fields-container">
                  <div>Expiration Date</div>
                  <Datepicker
                    className="voucher-dialog-form__field"
                    name="expirationDate"
                    isRequired
                    minDate={minDate}
                    popperModifiers={{
                      preventOverflow: {
                        enabled: false,
                      },
                    }}
                  />
                </div>

                <div className="voucher-dialog-form__fields-container">
                  <div>Group Name</div>
                  <GroupNameField
                    className="voucher-dialog-form__field"
                    controlType="select"
                    label=""
                    isRequired
                    isMulti={false}
                  />
                </div>

                <div className="voucher-dialog-form__fields-textarea-container">
                  <div>Player Cid</div>
                  <TextField
                    className="voucher-dialog-form__field-textarea"
                    name="playerCid"
                    rows="4"
                    isRequired
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
