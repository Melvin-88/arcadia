import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import { gameSelector } from '../../modules/game/state/selectors';
import { cancelStacks, setCancelStacksDialog } from '../../modules/game/state/actions';

interface ICancelStacksConfirmDialogProps {}

export const CancelStacksConfirmDialog: React.FC<ICancelStacksConfirmDialogProps> = () => {
  const { t } = useTranslation();

  const { cancelStacksDialog } = useSelector(gameSelector);
  const { isOpen } = cancelStacksDialog;

  const dispatch = useDispatch();

  const handleConfirm = useCallback(() => {
    dispatch(cancelStacks());
    dispatch(setCancelStacksDialog({ isOpen: false }));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(setCancelStacksDialog({ isOpen: false }));
  }, []);

  useEffect(() => () => {
    dispatch(setCancelStacksDialog({ isOpen: false }));
  }, []);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={t('CancelStacksConfirmDialog.Title')}
      onConfirm={handleConfirm}
      onClose={handleClose}
    >
      {t('CancelStacksConfirmDialog.Message')}
    </ConfirmDialog>
  );
};
