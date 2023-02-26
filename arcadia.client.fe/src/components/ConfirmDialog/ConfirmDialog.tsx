import React from 'react';
import { useTranslation } from 'react-i18next';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Dialog, IDialogProps } from '../Dialog/Dialog';
import { TextFit } from '../TextFit/TextFit';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import { SecondaryButton } from '../SecondaryButton/SecondaryButton';
import {
  getClassNames, getStyles, IConfirmDialogStyleProps, IConfirmDialogStyles,
} from './styles/ConfirmDialog';

interface IConfirmDialogProps extends Omit<IDialogProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IConfirmDialogStyleProps, IConfirmDialogStyles>;
  onConfirm: () => void;
}

const ConfirmDialogBase: React.FC<IConfirmDialogProps> = ({
  classNameCard,
  styles,
  onConfirm,
  onClose,
  children,
  ...restProps
}) => {
  const { t } = useTranslation();

  const classNames = getClassNames(styles, { classNameCard });

  return (
    <Dialog
      classNameCard={classNames.classNameCard}
      onClose={onClose}
      {...restProps}
    >
      <div className={classNames.content}>
        {children}
      </div>
      <div className={classNames.buttons}>
        <PrimaryButton className={classNames.button} onClick={onConfirm}>
          <TextFit>
            {t('ConfirmDialog.Confirm')}
          </TextFit>
        </PrimaryButton>
        <SecondaryButton className={classNames.button} onClick={onClose}>
          <TextFit>
            {t('ConfirmDialog.Cancel')}
          </TextFit>
        </SecondaryButton>
      </div>
    </Dialog>
  );
};

export const ConfirmDialog = styled<IConfirmDialogProps, IConfirmDialogStyleProps, IConfirmDialogStyles>(
  ConfirmDialogBase,
  getStyles,
);
