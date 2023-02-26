import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import { quitConfirmDialogSelector } from '../../modules/app/selectors';
import { setQuitConfirmDialog, quit } from '../../modules/app/actions';
import { QuitReason } from '../../types/general';

interface IQuitConfirmDialogProps {}

export const QuitConfirmDialog: React.FC<IQuitConfirmDialogProps> = () => {
  const { t } = useTranslation();

  const { isOpen } = useSelector(quitConfirmDialogSelector);

  const dispatch = useDispatch();

  const handleConfirm = useCallback(() => {
    dispatch(quit({ reason: QuitReason.manual }));
    dispatch(setQuitConfirmDialog({ isOpen: false }));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(setQuitConfirmDialog({ isOpen: false }));
  }, []);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={t('QuitConfirmDialog.Title')}
      onConfirm={handleConfirm}
      onClose={handleClose}
    >
      {t('QuitConfirmDialog.Message')}
    </ConfirmDialog>
  );
};
