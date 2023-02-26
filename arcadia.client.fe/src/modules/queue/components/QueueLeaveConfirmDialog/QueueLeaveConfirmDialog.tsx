import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmDialog } from '../../../../components/ConfirmDialog/ConfirmDialog';
import { queueLeaveDialogSelector } from '../../selectors';
import { leaveQueue, setQueueLeaveDialog } from '../../actions';

interface IQueueLeaveConfirmDialogProps {}

export const QueueLeaveConfirmDialog: React.FC<IQueueLeaveConfirmDialogProps> = () => {
  const { t } = useTranslation();

  const { isOpen } = useSelector(queueLeaveDialogSelector);
  const dispatch = useDispatch();

  const handleConfirm = useCallback(() => {
    dispatch(leaveQueue());
    dispatch(setQueueLeaveDialog({ isOpen: false }));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(setQueueLeaveDialog({ isOpen: false }));
  }, []);

  useEffect(() => () => {
    dispatch(setQueueLeaveDialog({ isOpen: false }));
  }, []);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={t('QueueLeaveConfirmDialog.Title')}
      onConfirm={handleConfirm}
      onClose={handleClose}
    >
      {t('QueueLeaveConfirmDialog.Message')}
    </ConfirmDialog>
  );
};
