import React from 'react';
import classNames from 'classnames';
import {
  Button, ButtonColor, ButtonColorUnion,
} from '../../Button/Button';
import { IDialogProps, Dialog } from '../Dialog/Dialog';
import './styles/DialogConfirmation.scss';

export interface IDialogConfirmationProps extends IDialogProps {
  cancelText?: string
  submitText?: string
  isLoading?: boolean
  submitBtnColor?: ButtonColorUnion
  onSubmit: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const DialogConfirmation: React.FC<IDialogConfirmationProps> = ({
  className,
  isOpen,
  isLoading,
  title,
  children,
  submitBtnColor = ButtonColor.secondary,
  cancelText = 'Cancel',
  submitText = 'Save changes',
  onClose,
  onSubmit,
  ...restProps
}) => (
  <Dialog
    className={classNames('dialog-confirm', className)}
    isOpen={isOpen}
    title={title}
    onClose={onClose}
    footer={(
      <>
        <Button
          className="dialog-confirm__btn"
          disabled={isLoading}
          onClick={onClose}
        >
          {cancelText}
        </Button>
        <Button
          className="dialog-confirm__btn"
          isLoading={isLoading}
          color={submitBtnColor}
          onClick={onSubmit}
        >
          {submitText}
        </Button>
      </>
    )}
    {...restProps}
  >
    {children}
  </Dialog>
);
