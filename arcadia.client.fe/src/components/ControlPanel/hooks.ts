import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { setBuy } from '../../modules/buy/state/actions';
import { fire, fireStop, sendRailPosition } from '../../modules/game/state/actions';
import { mergeAutoplay, setAutoSwingMode } from '../../modules/autoplay/state/actions';
import { mergeSoundsConfig, setSessionStatus } from '../../modules/app/actions';
import { setQueueLeaveDialog } from '../../modules/queue/actions';
import { mergeBetBehind } from '../../modules/betBehind/state/actions';
import { mergeChangeBet } from '../../modules/changeBet/state/actions';
import { soundsConfigSelector } from '../../modules/app/selectors';
import { TiltMode } from '../../types/autoplay';
import { SessionStatus } from '../../types/session';
import { betBehindSelector } from '../../modules/betBehind/state/selectors';
import { SoundsController } from '../../services/sounds/controller';
import { ButtonSound } from '../../services/sounds/types';

export const useControlPanel = (tiltMode: TiltMode) => {
  const dispatch = useDispatch();
  const soundsController = SoundsController.getInstance();
  const { isAllSoundsMuted } = useSelector(soundsConfigSelector);
  const { betBehindStatus } = useSelector(betBehindSelector);

  const handleAutoSwingClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.primary);
    dispatch(setAutoSwingMode({ mode: tiltMode === TiltMode.auto ? TiltMode.manual : TiltMode.auto }));
  }, [tiltMode, soundsController]);

  const handleBuyClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.primary);
    dispatch(setBuy({ isOpen: true }));
  }, [soundsController]);

  const handleQueueClick = useCallback(() => {
    dispatch(setQueueLeaveDialog({ isOpen: true }));
  }, []);

  const handleFire = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.primary);
    dispatch(fire());
  }, [soundsController]);

  const handleFireStop = useCallback(() => {
    dispatch(fireStop());
  }, []);

  const handleStopAutoplay = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.primary);
    dispatch(setSessionStatus({ status: SessionStatus.playing }));
  }, [soundsController]);

  const handleJoystickPositionChange = useCallback(debounce((position: number) => {
    dispatch(sendRailPosition({ railPosition: Math.round(-position) }));
  }, 75, {
    leading: true,
    maxWait: 200,
  }), []);

  const handleAutoplayClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.primary);
    dispatch(setSessionStatus({ status: SessionStatus.playing }));
    dispatch(mergeAutoplay({ isSnackbarOpen: true }));
  }, [soundsController]);

  const handleSwitchMuteAll = useCallback(() => {
    dispatch(mergeSoundsConfig({
      isAllSoundsMuted: !isAllSoundsMuted,
    }));
  }, [isAllSoundsMuted]);

  const handleBetBehindClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.primary);
    dispatch(mergeBetBehind({ isSnackbarOpen: true }));
  }, [soundsController]);

  const handleChangeBetClick = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.primary);
    dispatch(mergeChangeBet({ isSnackbarOpen: true }));
  }, [soundsController]);

  return {
    isAllSoundsMuted,
    betBehindStatus,
    handleAutoSwingClick,
    handleBuyClick,
    handleQueueClick,
    handleFire,
    handleFireStop,
    handleStopAutoplay,
    handleJoystickPositionChange,
    handleAutoplayClick,
    handleSwitchMuteAll,
    handleBetBehindClick,
    handleChangeBetClick,
  };
};
