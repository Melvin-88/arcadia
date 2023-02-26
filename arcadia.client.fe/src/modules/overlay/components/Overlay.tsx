import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlayingNowOverlay } from './PlayingNowOverlay';
import { overlaySelector } from '../state/selectors';
import { mergeOverlay } from '../state/actions';
import { NOTIFICATION_OVERLAY_AUTO_HIDE_DELAY } from '../../../constants';
import { ScatterRoundOverlay, ScatterRoundOverlayType } from './ScatterRoundOverlay';
import { LoadingOverlay } from '../../../components/loaders/LoadingOverlay/LoadingOverlay';

export interface IOverlayProps {
}

export const Overlay: React.FC<IOverlayProps> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    isMachineSeedingVisible,
    isRegularRoundStartVisible,
    isScatterRoundStartVisible,
    isScatterRoundWonVisible,
  } = useSelector(overlaySelector);

  const handleCloseRegularRoundStartOverlay = useCallback(() => {
    dispatch(mergeOverlay({
      isRegularRoundStartVisible: false,
    }));
  }, []);

  const handleCloseScatterRoundStartOverlay = useCallback(() => {
    dispatch(mergeOverlay({
      isScatterRoundStartVisible: false,
    }));
  }, []);

  const handleCloseScatterRoundWonOverlay = useCallback(() => {
    dispatch(mergeOverlay({
      isScatterRoundWonVisible: false,
    }));
  }, []);

  return (
    <>
      <LoadingOverlay
        isVisible={isMachineSeedingVisible}
        message={t('MachineSeedingOverlay.Message')}
      />
      <PlayingNowOverlay
        isVisible={isRegularRoundStartVisible}
        autoCloseDelay={NOTIFICATION_OVERLAY_AUTO_HIDE_DELAY}
        onClose={handleCloseRegularRoundStartOverlay}
      />
      <ScatterRoundOverlay
        isVisible={isScatterRoundStartVisible}
        type={ScatterRoundOverlayType.play}
        onClose={handleCloseScatterRoundStartOverlay}
      />
      <ScatterRoundOverlay
        isVisible={isScatterRoundWonVisible}
        type={ScatterRoundOverlayType.won}
        onClose={handleCloseScatterRoundWonOverlay}
      />
    </>
  );
};
