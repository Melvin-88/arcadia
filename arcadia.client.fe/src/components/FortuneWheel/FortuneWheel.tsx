import React, { useEffect, useMemo, useRef } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { v4 as uuidv4 } from 'uuid';
import { motion, useAnimation } from 'framer-motion';
import imgFortuneWheel from '../../assets/images/fortuneWheel.png';
import { Color, FontFamily } from '../../styles/constants';
import { preprocessData } from './helpers';
import { IPhantomChipWin } from '../../modules/game/types';
import { SoundsController } from '../../services/sounds/controller';
import { GameEventSound } from '../../services/sounds/types';
import { usePrevious } from '../../hooks/usePrevious';
import {
  getClassNames, getStyles, IFortuneWheelStyleProps, IFortuneWheelStyles,
} from './styles/FortuneWheel';

export interface IFortuneWheelProps extends Partial<IFortuneWheelStyleProps> {
  styles?: IStyleFunctionOrObject<IFortuneWheelStyleProps, IFortuneWheelStyles>;
  values: number[];
  winData: IPhantomChipWin | null;
  currency: string;
  animationTimeMS: number;
  onSpinningStart?: (winData: IPhantomChipWin) => void;
  onSpinningComplete?: (winData: IPhantomChipWin) => void;
  onRefreshStart?: (winData: IPhantomChipWin) => void;
  onAnimationComplete?: (winData: IPhantomChipWin) => void;
}

const soundsController = SoundsController.getInstance();

const startTickSoundInterval = (timeout: number): number => window.setInterval(() => {
  soundsController.playGameEventSound(GameEventSound.fortuneWheelTick);
}, timeout);

const FortuneWheelBase: React.FC<IFortuneWheelProps> = ({
  styles,
  className,
  values,
  winData,
  currency,
  animationTimeMS,
  onSpinningStart = () => {},
  onSpinningComplete = () => {},
  onRefreshStart = () => {},
  onAnimationComplete = () => {},
}) => {
  const canvasId = useRef(uuidv4());
  const containerAnimationControls = useAnimation();
  const wheelAnimationControls = useAnimation();
  const canvasAnimationControls = useAnimation();

  const previousWinData = usePrevious(winData);

  const { segments } = useMemo(() => (
    winData
      ? preprocessData(values, winData.value, currency)
      : { segments: [] }
  ), [winData?.id, values, currency]);

  useEffect(() => {
    const ROTATION_LINE_HEIGHT_COMPENSATION_ANGLE = -1;
    const segmentsCount = segments.length;

    // Creation using "new" forced by Winwheel.js
    // eslint-disable-next-line no-new
    new window.Winwheel({
      canvasId: canvasId.current,
      numSegments: segmentsCount,
      fillStyle: 'transparent',
      strokeStyle: 'transparent',
      textFontFamily: FontFamily.secondary,
      textFillStyle: Color.white,
      textStrokeStyle: Color.black,
      textFontWeight: 900,
      textFontSize: 100,
      textLineWidth: 6,
      textMargin: 140,
      textAlignment: 'outer',
      textDirection: 'reversed',
      rotationAngle: -360 / segmentsCount / 2 + ROTATION_LINE_HEIGHT_COMPENSATION_ANGLE,
      segments,
    });
  }, [segments]);

  useEffect(() => {
    let intervalTick: number;

    if (winData && previousWinData?.id !== winData?.id) {
      (async function animateWheel() {
        const animationTimeInSeconds = animationTimeMS / 1000;

        canvasAnimationControls.start({ opacity: 1 });

        await containerAnimationControls.start({
          y: '25%',
          transition: {
            duration: animationTimeInSeconds * 0.1,
          },
        });

        onSpinningStart(winData);
        soundsController.playGameEventSound(GameEventSound.fortuneWheelStart);

        intervalTick = startTickSoundInterval(animationTimeInSeconds * 10);
        await wheelAnimationControls.start({
          rotate: [0, 180],
          transition: {
            duration: animationTimeInSeconds * 0.09,
            ease: 'linear',
          },
        });
        window.clearInterval(intervalTick);

        intervalTick = startTickSoundInterval(animationTimeInSeconds * 5);
        await wheelAnimationControls.start({
          rotate: [180, 360 * 4, 360 * 5.3],
          transition: {
            duration: animationTimeInSeconds * 0.335,
            times: [0, 0.68, 1],
            ease: 'linear',
          },
        });
        window.clearInterval(intervalTick);

        intervalTick = startTickSoundInterval(animationTimeInSeconds * 20);
        await wheelAnimationControls.start({
          rotate: [360 * 5.3, 360 * 5.5],
          transition: {
            duration: animationTimeInSeconds * 0.125,
            ease: 'linear',
          },
        });
        window.clearInterval(intervalTick);

        onSpinningComplete(winData);

        await wheelAnimationControls.start({
          rotate: [360 * 5.5, 360 * 5.5],
          transition: {
            duration: animationTimeInSeconds * 0.25,
            ease: 'linear',
          },
        });

        onRefreshStart(winData);

        canvasAnimationControls.start({ opacity: 0 });

        await containerAnimationControls.start({
          y: '-100%',
          transition: {
            duration: animationTimeInSeconds * 0.05,
          },
        });

        wheelAnimationControls.start({
          rotate: 0,
          transition: {
            duration: 0,
          },
        });

        await containerAnimationControls.start({
          y: [null, '0%'],
          transition: {
            times: [0, 1],
            duration: animationTimeInSeconds * 0.05,
          },
        });

        onAnimationComplete(winData);
      }());
    }

    return () => {
      window.clearInterval(intervalTick);
    };
  }, [
    containerAnimationControls,
    wheelAnimationControls,
    canvasAnimationControls,
    previousWinData,
    winData,
    animationTimeMS,
    onSpinningStart,
    onSpinningComplete,
    onRefreshStart,
    onAnimationComplete,
  ]);

  const classNames = getClassNames(styles, {
    className,
  });

  return (
    <div className={classNames.root}>
      <motion.div
        className={classNames.container}
        animate={containerAnimationControls}
      >
        <motion.div className={classNames.wheel} animate={wheelAnimationControls}>
          <img
            className={classNames.wheelImg}
            src={imgFortuneWheel}
            alt=""
          />
          <motion.canvas
            id={canvasId.current}
            className={classNames.canvas}
            width={2000}
            height={2000}
            animate={canvasAnimationControls}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export const FortuneWheel = React.memo(
  styled<
    IFortuneWheelProps,
    IFortuneWheelStyleProps,
    IFortuneWheelStyles
  >(
    FortuneWheelBase,
    getStyles,
  ),
);
