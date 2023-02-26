import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import imgControlPanel from '../../assets/images/controlPanel.png';
import { AutoplayButton } from './buttons/AutoplayButton';
import { VolumeButton } from './buttons/VolumeButton';
import { BetBehindButton } from './buttons/BetBehindButton';
import { AutoswingButton } from './buttons/AutoswingButton';
import { FireButton } from './buttons/FireButton/FireButton';
import { StopButton } from './buttons/StopButton/StopButton';
import { ChangeBetButton } from './buttons/ChangeBetButton';
import { QueueButton } from './buttons/QueueButton';
import { BuyButton } from './buttons/BuyButton/BuyButton';
import { Joystick } from './Joystick/Joystick';
import { Clock } from './Clock/Clock';
import { TotalWinIndicator } from './TotalWinIndicator/TotalWinIndicator';
import { ControlPanelState } from './constants';
import { BetBehindStatusBar } from '../../modules/betBehind/components/BetBehindStatusBar/BetBehindStatusBar';
import { useControlPanel } from './hooks';
import { TiltMode } from '../../types/autoplay';
import {
  getClassNames, getStyles, IControlPanelStyleProps, IControlPanelStyles,
} from './styles/ControlPanel';

export interface IControlPanelProps extends Partial<IControlPanelStyleProps> {
  styles?: IStyleFunctionOrObject<IControlPanelStyleProps, IControlPanelStyles>;
  controlPanelState: ControlPanelState;
  sessionId: string;
  isAutoplayEnabled?: boolean;
  tiltMode: TiltMode;
  totalWin: number;
  currency: string;
}

const ControlPanelBase: React.FC<IControlPanelProps> = ({
  styles,
  className,
  controlPanelState,
  sessionId,
  isAutoplayEnabled,
  tiltMode,
  totalWin,
  currency,
}) => {
  const { t } = useTranslation();

  const {
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
  } = useControlPanel(tiltMode);

  const classNames = getClassNames(styles, {
    className,
  });

  return (
    <div className={classNames.root}>
      <img
        className={classNames.panelBackground}
        src={imgControlPanel}
        alt=""
      />

      { (controlPanelState === ControlPanelState.viewing || controlPanelState === ControlPanelState.viewingBetBehind) && (
        <BuyButton className={classNames.mainActionBtn} onClick={handleBuyClick} />
      ) }

      { (controlPanelState === ControlPanelState.inQueue || controlPanelState === ControlPanelState.inQueueBetBehind) && (
        <QueueButton className={classNames.mainActionBtn} onClick={handleQueueClick} />
      ) }

      { controlPanelState === ControlPanelState.playing && (
        <>
          <AutoswingButton
            className={classNames.autoSwingBtn}
            isDisabled={!isAutoplayEnabled}
            onClick={handleAutoSwingClick}
          />
          <AutoplayButton
            className={classNames.autoplayBtn}
            onClick={handleAutoplayClick}
          />
          { isAutoplayEnabled
            ? (
              <StopButton className={classNames.mainActionBtn} onClick={handleStopAutoplay} />
            ) : (
              <FireButton
                className={classNames.mainActionBtn}
                onTouchStart={handleFire}
                onTouchEnd={handleFireStop}
                onMouseDown={handleFire}
                onMouseUp={handleFireStop}
              />
            )}
          <Joystick
            className={classNames.joystick}
            isAutoSwingEnabled={isAutoplayEnabled && tiltMode === TiltMode.auto}
            onChange={handleJoystickPositionChange}
          />
        </>
      )}

      { controlPanelState !== ControlPanelState.playing && (
        controlPanelState === ControlPanelState.viewingBetBehind || controlPanelState === ControlPanelState.inQueueBetBehind
          ? (
            <BetBehindStatusBar
              className={classNames.betBehindStatus}
              status={betBehindStatus}
            />
          ) : (
            <BetBehindButton
              className={classNames.betBehindBtn}
              onClick={handleBetBehindClick}
            />
          )
      ) }

      <VolumeButton
        className={classNames.volumeBtn}
        isAllSoundsMuted={isAllSoundsMuted}
        onClick={handleSwitchMuteAll}
      />
      <ChangeBetButton
        className={classNames.changeBetBtn}
        onClick={handleChangeBetClick}
      />
      <div className={classNames.footer}>
        <Clock className={classNames.clock} />
        <TotalWinIndicator
          className={classNames.totalWin}
          totalWin={totalWin}
          currency={currency}
        />
        <div className={classNames.sessionId}>
          {t('ControlPanel.SessionId', { sessionId })}
        </div>
      </div>
    </div>
  );
};

export const ControlPanel = React.memo(
  styled<
    IControlPanelProps,
    IControlPanelStyleProps,
    IControlPanelStyles
  >(
    ControlPanelBase,
    getStyles,
  ),
);
