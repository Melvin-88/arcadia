import React, { ReactNode, useCallback } from 'react';
import {
  Form, ButtonColor, PasswordField, DialogConfirmation, DialogSection,
} from 'arcadia-common-fe';
import './DialogAction.scss';

export type ActionTypeUnion = 'positive' | 'negative';

export const ActionType : { [key in ActionTypeUnion] : ActionTypeUnion } = {
  positive: 'positive',
  negative: 'negative',
};

export interface IDialogActionProps<TValues> {
  isOpen: boolean
  action: string
  message?: string
  initialValues?: TValues
  subject: string
  isLoading?: boolean
  topContent?: React.ReactNode,
  bottomContent?: React.ReactNode,
  withPasswordConfirm?: boolean
  actionType?: ActionTypeUnion
  onSubmit: (data: TValues) => void
  onClose: () => void
  children?: ReactNode
}

let submit: () => void;

export const DialogAction: <TValues>(props: IDialogActionProps<TValues>) => React.ReactElement = ({
  isOpen,
  isLoading,
  message,
  initialValues,
  withPasswordConfirm = false,
  action,
  subject,
  children,
  topContent,
  bottomContent,
  actionType = ActionType.positive,
  onSubmit,
  onClose,
}) => {
  const handleSubmitClick = useCallback(() => {
    submit();
  }, [submit]);

  return (
    <DialogConfirmation
      className="dialog-action"
      footerClassNames="dialog-action__footer"
      isOpen={isOpen}
      isLoading={isLoading}
      title={`${action} ${subject}`}
      submitText={action}
      submitBtnColor={actionType === ActionType.positive ? ButtonColor.secondary : ButtonColor.quaternary}
      onSubmit={handleSubmitClick}
      onClose={onClose}
    >
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ handleSubmit }) => {
          submit = handleSubmit;

          return (
            <form onSubmit={handleSubmit}>
              {topContent}
              <DialogSection className="dialog-action__text">
                {message || `Are you sure you want to ${action.toLowerCase()} the ${subject.toLowerCase()}?`}
              </DialogSection>
              {children}
              {
                withPasswordConfirm && (
                  <DialogSection>
                    <div className="dialog-action__field">
                      <div className="dialog-action__field-label">Confirm changes with your password</div>
                      <PasswordField
                        label=""
                        withSymbolsValidation={false}
                      />
                    </div>
                  </DialogSection>
                )
              }
              {bottomContent}
            </form>
          );
        }}
      />
    </DialogConfirmation>
  );
};
