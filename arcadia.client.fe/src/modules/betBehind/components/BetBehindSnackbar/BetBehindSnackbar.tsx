import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import iconBetBehind from '../../../../assets/images/betBehind.png';
import { SnackbarSection } from '../../../../components/Snackbar/SnackbarSection';
import { RoundsCounter } from '../../../../components/RoundsCounter/RoundsCounter';
import { Slider } from '../../../../components/Slider/Slider';
import { Snackbar } from '../../../../components/Snackbar/Snackbar';
import { Switch } from '../../../../components/Switch/Switch';
import { betBehindSelector } from '../../state/selectors';
import { mergeBetBehindConfig, mergeBetBehind, enableBetBehind } from '../../state/actions';
import { TextFit } from '../../../../components/TextFit/TextFit';
import { formatCurrency } from '../../../../services/dataFormat';
import { PlayButton } from '../../../../components/PlayButton/PlayButton';
import {
  getClassNames, getStyles, IBetBehindSnackbarStyleProps, IBetBehindSnackbarStyles,
} from './styles/BetBehindSnackbar';

export interface IBetBehindSnackbarProps {
  styles?: IStyleFunctionOrObject<IBetBehindSnackbarStyleProps, IBetBehindSnackbarStyles>;
  betInCash: number;
  currency: string;
}

const BetBehindSnackbarBase: React.FC<IBetBehindSnackbarProps> = ({
  styles, betInCash, currency,
}) => {
  const { t } = useTranslation();

  const { isSnackbarOpen, config } = useSelector(betBehindSelector);
  const {
    stopAfterRounds, stopIfJackpot, singleWinThreshold, lowLimitMultiplier, hiLimitMultiplier,
  } = config;
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(mergeBetBehind({ isSnackbarOpen: false }));
  }, []);

  const handleChangeStopAfterRounds = useCallback((value: number) => {
    dispatch(mergeBetBehindConfig({
      stopAfterRounds: value,
    }));
  }, []);

  const handleChangeSingleWinThreshold = useCallback(debounce((value: number) => {
    dispatch(mergeBetBehindConfig({ singleWinThreshold: value }));
  }, 250, {
    maxWait: 500,
  }), []);

  const handleChangeStopIfJackpotWin = useCallback((value: boolean) => {
    dispatch(mergeBetBehindConfig({
      stopIfJackpot: value,
    }));
  }, []);

  const handleEnableBetBehind = useCallback(() => {
    dispatch(enableBetBehind({ config }));
    handleClose();
  }, [config, handleClose]);

  const classNames = getClassNames(styles);

  const headerContent = (
    <>
      <img
        className={classNames.headerIcon}
        src={iconBetBehind}
        alt=""
      />
      {t('BetBehindSnackbar.BetBehindSetup')}
    </>
  );

  return (
    <Snackbar
      classNameHeader={classNames.snackbarHeader}
      headerContent={headerContent}
      isOpen={isSnackbarOpen}
      e2eSelector="bet-behind-setup-snackbar"
      onClose={handleClose}
    >
      <SnackbarSection className={classNames.roundsCounterSection}>
        <div className={classNames.roundsCounterTitle}>{t('BetBehindSnackbar.StopAfter')}</div>
        <RoundsCounter
          value={stopAfterRounds}
          minValue={1}
          onChange={handleChangeStopAfterRounds}
        />
      </SnackbarSection>
      <SnackbarSection className={classNames.sliderSection}>
        {t('BetBehindSnackbar.StopIfSingleWinIsAbove')}
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
        {t('BetBehindSnackbar.StopIfJackpotIsWon')}
        <Switch
          value={stopIfJackpot}
          e2eSelector="stop-if-jackpot-won-switch"
          onChange={handleChangeStopIfJackpotWin}
        />
      </SnackbarSection>
      <SnackbarSection className={classNames.playButtonSection}>
        <PlayButton
          className={classNames.playButton}
          onClick={handleEnableBetBehind}
        />
      </SnackbarSection>
    </Snackbar>
  );
};

export const BetBehindSnackbar = React.memo(
  styled<
    IBetBehindSnackbarProps,
    IBetBehindSnackbarStyleProps,
    IBetBehindSnackbarStyles
  >(
    BetBehindSnackbarBase,
    getStyles,
  ),
);
