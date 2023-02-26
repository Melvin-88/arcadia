import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Dialog } from '../../../../components/Dialog/Dialog';
import { resultDialogSelector } from '../../../app/selectors';
import { setResult, quit } from '../../../app/actions';
import { formatCurrency } from '../../../../services/dataFormat';
import { TextFit } from '../../../../components/TextFit/TextFit';
import { QuitReason } from '../../../../types/general';
import {
  getClassNames,
  getStyles,
  IResultDialogStyleProps,
  IResultDialogStyles,
} from './styles/ResultDialog.styles';

interface IResultDialogProps {
  styles?: IStyleFunctionOrObject<IResultDialogStyleProps, IResultDialogStyles>;
}

const ResultDialogBase: React.FC<IResultDialogProps> = ({ styles }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { isOpen, totalWin, currency } = useSelector(resultDialogSelector);

  const handleClose = useCallback(() => {
    dispatch(setResult());
    dispatch(quit({ reason: QuitReason.manual }));
  }, []);

  const classNames = getClassNames(styles);

  return (
    <Dialog
      classNameContainer={classNames.container}
      classNameCard={classNames.card}
      isOpen={isOpen}
      withRays
      onClose={handleClose}
    >
      <div className={classNames.content}>
        <p className={classNames.title}>{t('ResultDialog.Title')}</p>
        <TextFit
          className={classNames.amount}
          mode="single"
          forceSingleModeWidth={false}
        >
          {formatCurrency(totalWin || 0, { currency, minimumFractionDigits: 0 })}
        </TextFit>
      </div>
    </Dialog>
  );
};

export const ResultDialog = React.memo(
  styled<
    IResultDialogProps,
    IResultDialogStyleProps,
    IResultDialogStyles
  >(
    ResultDialogBase,
    getStyles,
  ),
);
