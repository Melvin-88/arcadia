import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { Snackbar } from '../../../components/Snackbar/Snackbar';
import { SnackbarSection } from '../../../components/Snackbar/SnackbarSection';
import { RoundsCounter } from '../../../components/RoundsCounter/RoundsCounter';
import { Slider } from '../../../components/Slider/Slider';
import { Switch } from '../../../components/Switch/Switch';
import { mergeAutoplay, mergeAutoplayConfig } from '../state/actions';
import { autoplaySelector } from '../state/selectors';
import { TiltMode } from '../../../types/autoplay';
import { TextFit } from '../../../components/TextFit/TextFit';
import { formatCurrency } from '../../../services/dataFormat';
import { PlayButton } from '../../../components/PlayButton/PlayButton';
import { setSessionStatus } from '../../app/actions';
import { SessionStatus } from '../../../types/session';
import {
  getClassNames, getStyles, IAutoplaySetupSnackbarStyleProps, IAutoplaySetupSnackbarStyles,
} from './styles/AutoplaySetupSnackbar';

export interface IAutoplaySetupSnackbarProps {
  styles?: IStyleFunctionOrObject<IAutoplaySetupSnackbarStyleProps, IAutoplaySetupSnackbarStyles>;
  betInCash: number;
  currency: string;
  isPlayDisabled?: boolean;
}

const AutoplaySetupSnackbarBase: React.FC<IAutoplaySetupSnackbarProps> = ({
  styles, betInCash, currency, isPlayDisabled, ...restProps
}) => {
  const { t } = useTranslation();
  const { isSnackbarOpen, config } = useSelector(autoplaySelector);
  const {
    stopAfterRounds, stopIfJackpot, singleWinThreshold, tiltMode, lowLimitMultiplier, hiLimitMultiplier,
  } = config;
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(mergeAutoplay({
      isSnackbarOpen: false,
    }));
  }, []);

  const handleChangeStopAfterRounds = useCallback((value: number) => {
    dispatch(mergeAutoplayConfig({
      stopAfterRounds: value,
    }));
  }, []);

  const handleChangeSingleWinThreshold = useCallback(debounce((value: number) => {
    dispatch(mergeAutoplayConfig({ singleWinThreshold: value }));
  }, 250, {
    maxWait: 500,
  }), []);

  const handleChangeStopIfJackpotWin = useCallback((value: boolean) => {
    dispatch(mergeAutoplayConfig({
      stopIfJackpot: value,
    }));
  }, []);

  const handleChangeAutoSwing = useCallback((value: boolean) => {
    dispatch(mergeAutoplayConfig({
      tiltMode: value ? TiltMode.auto : TiltMode.manual,
    }));
  }, []);

  const handleEnableAutoplay = useCallback(() => {
    dispatch(setSessionStatus({ status: SessionStatus.autoplay }));
    handleClose();
  }, [handleClose]);

  const classNames = getClassNames(styles);

  return (
    <Snackbar
      classNameHeader={classNames.snackbarHeader}
      headerContent={t('AutoplaySetupSnackbar.AutoplaySetup')}
      isOpen={isSnackbarOpen}
      e2eSelector="autoplay-setup-snackbar"
      onClose={handleClose}
      {...restProps}
    >
      <SnackbarSection className={classNames.roundsCounterSection}>
        <div className={classNames.roundsCounterTitle}>{t('AutoplaySetupSnackbar.StopAfter')}</div>
        <RoundsCounter
          value={stopAfterRounds}
          minValue={1}
          onChange={handleChangeStopAfterRounds}
        />
      </SnackbarSection>
      <SnackbarSection className={classNames.sliderSection}>
        {t('AutoplaySetupSnackbar.StopIfSingleWinIsAbove')}
        <div className={classNames.sliderContainer}>
          <Slider
            className={classNames.slider}
            min={betInCash * lowLimitMultiplier}
            max={betInCash * hiLimitMultiplier}
            defaultValue={singleWinThreshold}
            onChange={handleChangeSingleWinThreshold}
          />
          <div className={classNames.sliderValue}>
            <TextFit
              mode="single"
              forceSingleModeWidth={false}
            >
              { formatCurrency(singleWinThreshold, { currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
            </TextFit>
          </div>
        </div>
      </SnackbarSection>
      <SnackbarSection className={classNames.switchSection}>
        {t('AutoplaySetupSnackbar.StopIfJackpotIsWon')}
        <Switch
          value={stopIfJackpot}
          e2eSelector="stop-if-jackpot-won-switch"
          onChange={handleChangeStopIfJackpotWin}
        />
      </SnackbarSection>
      <SnackbarSection className={classNames.switchSection}>
        {t('AutoplaySetupSnackbar.AutoSwing')}
        <Switch
          value={tiltMode === TiltMode.auto}
          e2eSelector="autoswing-switch"
          onChange={handleChangeAutoSwing}
        />
      </SnackbarSection>
      <SnackbarSection className={classNames.playButtonSection}>
        <PlayButton
          className={classNames.playButton}
          isDisabled={isPlayDisabled}
          onClick={handleEnableAutoplay}
        />
      </SnackbarSection>
    </Snackbar>
  );
};

export const AutoplaySetupSnackbar = React.memo(
  styled<
    IAutoplaySetupSnackbarProps,
    IAutoplaySetupSnackbarStyleProps,
    IAutoplaySetupSnackbarStyles
  >(
    AutoplaySetupSnackbarBase,
    getStyles,
  ),
);
