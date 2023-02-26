import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { BetBehindStatus } from '../../../../types/betBehind';
import { Button } from '../../../../components/Button/Button';
import imgBetBehindStatusBackground from '../../../../assets/images/betBehindStatusBackground.png';
import imgBetBehind from '../../../../assets/images/betBehind.png';
import imgButtonStopMini from '../../../../assets/images/buttonStopMini.png';
import { disableBetBehind } from '../../state/actions';
import { TextFit } from '../../../../components/TextFit/TextFit';
import {
  getClassNames, getStyles, IBetBehindStatusBarStyleProps, IBetBehindStatusBarStyles,
} from './styles/BetBehindStatusBar';

export interface IBetBehindStatusBarProps extends Partial<IBetBehindStatusBarStyleProps> {
  styles?: IStyleFunctionOrObject<IBetBehindStatusBarStyleProps, IBetBehindStatusBarStyles>;
  status: BetBehindStatus;
}

const BetBehindStatusBarBase: React.FC<IBetBehindStatusBarProps> = ({
  styles, className, status,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const handleStop = useCallback(() => {
    dispatch(disableBetBehind());
  }, []);

  const classNames = getClassNames(styles, {
    className,
  });

  return (
    <div className={classNames.root}>
      <img className={classNames.background} src={imgBetBehindStatusBackground} alt="" />
      { (status === BetBehindStatus.pendingStart || status === BetBehindStatus.pendingEnd) && (
        <div className={classNames.content}>
          <img className={classNames.betBehindIcon} src={imgBetBehind} alt="bet behind" />
          <TextFit className={classNames.pendingLabel} forceSingleModeWidth={false}>
            <div className={classNames.labelText}>
              {t('BetBehindStatusBar.BetBehind')}
            </div>
            <div className={classNames.labelText}>
              { status === BetBehindStatus.pendingStart
                ? t('BetBehindStatusBar.StartsInNextRound')
                : t('BetBehindStatusBar.EndsAfterThisRound')}
            </div>
          </TextFit>
        </div>
      ) }

      { status === BetBehindStatus.playing && (
        <div className={classNames.content}>
          <TextFit className={classNames.stopLabel} forceSingleModeWidth={false}>
            <div className={classNames.labelText}>
              {t('BetBehindStatusBar.Stop')}
            </div>
          </TextFit>
          <Button
            className={classNames.buttonStop}
            normalImg={imgButtonStopMini}
            e2eSelector="bet-behind-status-stop-button"
            onClick={handleStop}
          />
          <TextFit className={classNames.betBehindLabel} forceSingleModeWidth={false}>
            <div className={classNames.labelText}>
              {t('BetBehindStatusBar.Bet')}
            </div>
            <div className={classNames.labelText}>
              {t('BetBehindStatusBar.Behind')}
            </div>
          </TextFit>
        </div>
      ) }
    </div>
  );
};

export const BetBehindStatusBar = styled<IBetBehindStatusBarProps, IBetBehindStatusBarStyleProps, IBetBehindStatusBarStyles>(
  BetBehindStatusBarBase,
  getStyles,
);
