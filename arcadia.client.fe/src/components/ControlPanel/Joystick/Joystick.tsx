import React, { useCallback, useEffect, useState } from 'react';
import {
  motion, PanInfo, useSpring, useTransform,
} from 'framer-motion';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { SoundsController } from '../../../services/sounds/controller';
import { SoundEffect } from '../../../services/sounds/types';
import { useDimensions } from '../../../hooks/useDimension';
import iconJoystickBase from '../../../assets/images/joystickBase.png';
import iconJoystickRail from '../../../assets/images/joystickRail.png';
import iconJoystickBall from '../../../assets/images/joystickBall.png';
import {
  getClassNames, getStyles, IJoystickStyleProps, IJoystickStyles,
} from './styles/Joystick';

const soundsController = SoundsController.getInstance();

const TICK_STEP = 20;

interface IJoystickProps extends Partial<IJoystickStyleProps> {
  styles?: IStyleFunctionOrObject<IJoystickStyleProps, IJoystickStyles>;
  arrowsMovementDebounce?: number;
  arrowsMovementStep?: number;
  onChange: (position: number) => void;
}

// TODO: Review and refactor/complete this file and all relative code

let moveLeftTimeout: number;
let moveRightTimeout: number;

export const JoystickBase: React.FC<IJoystickProps> = ({
  styles,
  className,
  isAutoSwingEnabled,
  arrowsMovementDebounce = 75,
  arrowsMovementStep = 5,
  onChange,
}) => {
  const [nextTickPoints, setNextTickPoints] = useState({ left: -TICK_STEP, right: TICK_STEP });
  const positionMotionValue = useSpring(0);

  const { ref: joystickRailRef, width: railWidth } = useDimensions<HTMLDivElement>();
  const { ref: joystickBallRef, width: ballDiameter } = useDimensions<HTMLDivElement>();

  const ballRadius = ballDiameter / 2;

  const ballX = useTransform(
    positionMotionValue,
    [-100, 0, 100],
    [-ballRadius, (railWidth / 2) - ballRadius, railWidth - ballRadius],
  );
  const ballY = useTransform(
    positionMotionValue,
    [-100, -70, 0, 70, 100],
    ['-78.5%', '-70.5%', '-60.5%', '-70.5%', '-78.5%'],
  );

  useEffect(() => {
    positionMotionValue.set(0);
  }, [isAutoSwingEnabled]);

  const handleChangeProgress = useCallback((progress: number) => {
    const nextRightTickPoint = Math.ceil((Math.floor(progress) + 1) / TICK_STEP) * TICK_STEP;
    const nextLeftTickPoint = nextRightTickPoint - TICK_STEP;

    positionMotionValue.set(progress, false);

    if (progress !== -100 && progress !== 100 && (progress <= nextTickPoints.left || progress >= nextTickPoints.right)) {
      setNextTickPoints({ left: nextLeftTickPoint, right: nextRightTickPoint });

      soundsController.playSoundEffect(SoundEffect.joystickTick);
    }

    onChange(progress);
  }, [nextTickPoints, onChange, soundsController]);

  const handleBallDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const progress = (((info.point.x + ballRadius) / railWidth) * 200) - 100;

    handleChangeProgress(progress);
  }, [handleChangeProgress, railWidth, ballRadius]);

  const handleMoveLeft = useCallback(() => {
    handleChangeProgress(Math.max(positionMotionValue.get() - arrowsMovementStep, -100));
  }, [positionMotionValue, arrowsMovementStep, handleChangeProgress]);

  const handleMoveRight = useCallback(() => {
    handleChangeProgress(Math.min(positionMotionValue.get() + arrowsMovementStep, 100));
  }, [positionMotionValue, arrowsMovementStep, handleChangeProgress]);

  const handleStartMoveLeft = useCallback(() => {
    handleMoveLeft();

    moveLeftTimeout = window.setInterval(() => {
      handleMoveLeft();
    }, arrowsMovementDebounce);
  }, [arrowsMovementDebounce, handleMoveLeft]);

  const handleStartMoveRight = useCallback(() => {
    handleMoveRight();

    moveRightTimeout = window.setInterval(() => {
      handleMoveRight();
    }, arrowsMovementDebounce);
  }, [arrowsMovementDebounce, handleMoveRight]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handleStartMoveLeft();
    }

    if (event.key === 'ArrowRight') {
      handleStartMoveRight();
    }
  }, [handleStartMoveLeft, handleStartMoveRight]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      clearInterval(moveLeftTimeout);
    }

    if (event.key === 'ArrowRight') {
      clearInterval(moveRightTimeout);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleKeyUp);
    };
  }, []);

  const classNames = getClassNames(styles, {
    className,
    isAutoSwingEnabled,
  });

  return (
    <div className={classNames.root} data-e2e-selector="joystick">
      <div className={classNames.joystickBase}>
        <img
          className={classNames.joystickBaseIcon}
          src={iconJoystickBase}
          alt="Joystick base"
        />
        <div
          ref={joystickRailRef}
          className={classNames.joystickRail}
        >
          <img
            className={classNames.joystickRailIcon}
            src={iconJoystickRail}
            alt="Joystick rail"
          />
          <motion.div
            ref={joystickBallRef}
            className={classNames.joystickBall}
            style={{
              x: ballX,
              y: ballY,
            }}
            drag={isAutoSwingEnabled ? undefined : 'x'}
            dragConstraints={{
              left: -ballRadius,
              right: railWidth - ballRadius,
            }}
            dragElastic={0}
            dragMomentum={false}
            data-e2e-selector="joystick-bar"
            onDrag={handleBallDrag}
          >
            <img
              className={classNames.joystickBallIcon}
              src={iconJoystickBall}
              alt="Joystick ball"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const Joystick = styled<IJoystickProps, IJoystickStyleProps, IJoystickStyles>(
  JoystickBase,
  getStyles,
);
