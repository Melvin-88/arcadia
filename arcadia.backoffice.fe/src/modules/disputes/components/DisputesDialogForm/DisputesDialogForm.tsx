import React, { useCallback } from 'react';
import {
  Form, TextField, PlayerCIDField, DialogConfirmation, DialogSection,
} from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { disputesDialogFormSelector } from '../../state/selectors';
import { IDispute, IPostDisputeRequestBody, IPutDisputeRequestBody } from '../../types';
import { postDispute, putDispute, setDisputeDialogForm } from '../../state/actions';
import { DisputesStatusField } from '../../../../components/fields/DisputesStatusField';
import { RebateCurrencyField } from '../../../../components/fields/RebateCurrencyField';
import { OperatorIdField } from '../../../../components/fields/OperatorIdField';
import './DisputesDialogForm.scss';

export interface IDisputesDialogFormProps {
}

let submitForm = () => {};

interface IFieldsContainerProps {
  className?: string
  title: string
}

const FieldsContainer: React.FC<IFieldsContainerProps> = ({ className, title, children }) => (
  <div className={classNames('disputes-dialog-form__fields-container', className)}>
    <div className="disputes-dialog-form__field-label">
      {title}
    </div>
    {children}
  </div>
);

export const DisputesDialogForm: React.FC<IDisputesDialogFormProps> = () => {
  const dispatch = useDispatch();
  const {
    isOpen, isLoading, initialValues,
  } = useSelector(disputesDialogFormSelector);
  const isEdit = !!(initialValues && initialValues.id);

  const handleFormSubmit = useCallback((values: IPostDisputeRequestBody | IPutDisputeRequestBody) => {
    if (isEdit) {
      dispatch(putDispute(values));
    } else {
      dispatch(postDispute(values));
    }
  }, [isEdit]);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleClose = useCallback(() => {
    dispatch(setDisputeDialogForm());
  }, []);

  const fullSizeClassName = 'disputes-dialog-form__fields-container--fullsize';

  const fields = [
    {
      title: 'Status',
      fieldNode: <DisputesStatusField isMulti={false} isRequired label="" />,
    }, {
      className: fullSizeClassName,
      title: 'Complaint',
      fieldNode: <TextField name="complaint" isRequired rows="2" />,
    }, {
      title: 'Rebate Currency',
      fieldNode: <RebateCurrencyField label="" />,
    }, {
      title: 'Rebate Sum',
      fieldNode: <TextField name="rebateSum" type="number" />,
    }, {
      title: 'Operator',
      fieldNode: <OperatorIdField isMulti={false} isRequired label="" />,
    }, {
      className: fullSizeClassName,
      title: 'Discussion',
      fieldNode: <TextField name="discussion" rows="2" />,
    }, {
      title: 'Player CID',
      fieldNode: <PlayerCIDField label="" />,
    }, {
      title: 'Session ID',
      fieldNode: <TextField name="sessionId" type="number" />,
    },
  ];

  return (
    <DialogConfirmation
      isOpen={isOpen}
      isLoading={isLoading}
      title={`${isEdit ? 'Edit' : 'Add'} Dispute`}
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        initialValues={initialValues as IDispute}
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form onSubmit={handleSubmit}>
              <DialogSection className="disputes-dialog-form__fields-groups">
                {fields.map(({ title, fieldNode, className }, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <FieldsContainer key={i} title={title} className={className}>
                    {fieldNode}
                  </FieldsContainer>
                ))}
              </DialogSection>
            </form>
          );
        }}
      />
    </DialogConfirmation>
  );
};
