import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { IProgressIndicatorProps, ProgressIndicator } from '../ProgressIndicator/ProgressIndicator';
import imgIdleTimeoutIndicatorProgressCircle from '../../assets/images/idleTimeoutIndicatorProgressCircle.png';
import imgHourglass from '../../assets/images/hourglass.png';
import { CircleSection, ICircleSectionsVisibilityMap } from './types';
import { SoundsController } from '../../services/sounds/controller';
import { GameEventSound } from '../../services/sounds/types';
import {
  getClassNames,
  getStyles,
  IIdleTimeoutIndicatorStyleProps,
  IIdleTimeoutIndicatorStyles,
} from './styles/IdleTimeoutIndicator';

const CIRCLE_SECTIONS_COUNT = 7;

export interface IIdleTimeoutIndicatorProps extends Omit<IProgressIndicatorProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IIdleTimeoutIndicatorStyleProps, IIdleTimeoutIndicatorStyles>;
  idleTimeoutSec: number;
  graceTimeoutSec: number;
  idleTimeoutStartTimestamp: number | null;
  onGraceTimeoutStart: () => void;
  onTimeOver: () => void;
}

const IdleTimeoutIndicatorBase: React.FC<IIdleTimeoutIndicatorProps> = ({
  styles,
  className,
  idleTimeoutSec,
  graceTimeoutSec,
  idleTimeoutStartTimestamp,
  onGraceTimeoutStart,
  onTimeOver,
  ...restProps
}) => {
  const { t } = useTranslation();
  const soundsController = SoundsController.getInstance();

  const [date, setDate] = useState(() => Date.now());

  const isDisabled = idleTimeoutStartTimestamp === null;

  const secondsFromStart = idleTimeoutStartTimestamp === null
    ? 0
    : Math.max(0, Math.floor((date - idleTimeoutStartTimestamp) / 1000));

  const summarySecondsLeft = isDisabled
    ? 0
    : Math.max(0, (idleTimeoutSec + graceTimeoutSec - secondsFromStart));

  const idleTimeoutSecondsLeft = summarySecondsLeft - graceTimeoutSec;
  const isGraceTimeoutStarted = idleTimeoutSecondsLeft <= 0;

  const secondsToShow = isGraceTimeoutStarted ? summarySecondsLeft : idleTimeoutSecondsLeft;

  const timeoutSound = useCallback(() => {
    soundsController.playGameEventSound(GameEventSound.timeout);
  }, [soundsController]);

  useEffect(() => {
    let interval: number;

    if (!isDisabled) {
      setDate(Date.now());

      interval = window.setInterval(() => {
        setDate(Date.now());
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isDisabled]);

  useEffect(() => {
    if (isDisabled) {
      return;
    }

    if (summarySecondsLeft === graceTimeoutSec) {
      timeoutSound();
      onGraceTimeoutStart();
    }

    if (summarySecondsLeft === 0) {
      timeoutSound();
      onTimeOver();
    }
  }, [isDisabled, summarySecondsLeft, graceTimeoutSec, onGraceTimeoutStart, onTimeOver, timeoutSound]);

  const circleSectionsVisibilityMap: ICircleSectionsVisibilityMap = useMemo(() => {
    const secondsPerSingleSection = (isGraceTimeoutStarted ? graceTimeoutSec : idleTimeoutSec) / CIRCLE_SECTIONS_COUNT;

    return {
      [CircleSection.first]: isDisabled || secondsToShow >= secondsPerSingleSection * 6,
      [CircleSection.second]: isDisabled || secondsToShow >= secondsPerSingleSection * 4,
      [CircleSection.third]: isDisabled || secondsToShow >= secondsPerSingleSection * 3,
      [CircleSection.forth]: isDisabled || secondsToShow >= secondsPerSingleSection * 2,
      [CircleSection.fifth]: isDisabled || secondsToShow >= secondsPerSingleSection,
      [CircleSection.sixth]: isDisabled || secondsToShow > 0,
    };
  }, [isDisabled, secondsToShow, idleTimeoutSec, graceTimeoutSec]);

  const classNames = getClassNames(styles, {
    className,
    secondsLength: secondsToShow.toString().length,
    circleSectionsVisibilityMap,
    isDisabled,
  });

  return (
    <ProgressIndicator className={classNames.root} {...restProps}>
      <img className={classNames.circleSection1} src={imgIdleTimeoutIndicatorProgressCircle} alt="" />
      <img className={classNames.circleSection2} src={imgIdleTimeoutIndicatorProgressCircle} alt="" />
      <img className={classNames.circleSection3} src={imgIdleTimeoutIndicatorProgressCircle} alt="" />
      <img className={classNames.circleSection4} src={imgIdleTimeoutIndicatorProgressCircle} alt="" />
      <img className={classNames.circleSection5} src={imgIdleTimeoutIndicatorProgressCircle} alt="" />
      <img className={classNames.circleSection6} src={imgIdleTimeoutIndicatorProgressCircle} alt="" />
      <div className={classNames.container}>
        <div className={classNames.timer}>
          <img
            className={classNames.hourglassImg}
            src={imgHourglass}
            alt=""
          />
          <div className={classNames.seconds}>
            { secondsToShow }
          </div>
        </div>
        <div className={classNames.title}>
          {t('IdleTimeoutIndicator.Sec')}
        </div>
      </div>
    </ProgressIndicator>
  );
};

export const IdleTimeoutIndicator = React.memo(
  styled<
    IIdleTimeoutIndicatorProps,
    IIdleTimeoutIndicatorStyleProps,
    IIdleTimeoutIndicatorStyles
  >(
    IdleTimeoutIndicatorBase,
    getStyles,
  ),
);
