import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { motion, useAnimation } from 'framer-motion';
import { SoundsController } from '../../services/sounds/controller';
import { SoundEffect } from '../../services/sounds/types';
import {
  getClassNames, getStyles, ICollapsibleStyleProps, ICollapsibleStyles,
} from './styles/Collapsible';

const ANIMATION_DURATION_IN_SECONDS = 0.75;

const soundsController = SoundsController.getInstance();

export interface ICollapsibleProps extends Partial<ICollapsibleStyleProps> {
  styles?: IStyleFunctionOrObject<ICollapsibleStyleProps, ICollapsibleStyles>;
  collapseImage: string;
}

export const CollapsibleBase: React.FC<ICollapsibleProps> = ({
  styles, className, classNameContent, classNameArrow, collapseImage, children,
}) => {
  const rootAnimationControls = useAnimation();
  const arrowAnimationControls = useAnimation();

  const classNames = getClassNames(styles, {
    className,
    classNameContent,
    classNameArrow,
    animationDurationInSeconds: ANIMATION_DURATION_IN_SECONDS,
  });

  const handleContentClick = useCallback(() => {
    soundsController.playSoundEffect(SoundEffect.whooshSecondary);

    rootAnimationControls.start({
      visibility: 'hidden',
      opacity: 0,
      y: '-100%',
      transition: {
        duration: ANIMATION_DURATION_IN_SECONDS,
      },
    });

    arrowAnimationControls.start({
      visibility: 'visible',
      opacity: 1,
      y: '0%',
      x: '-50%',
      transition: {
        duration: ANIMATION_DURATION_IN_SECONDS,
      },
    });
  }, [rootAnimationControls, arrowAnimationControls]);

  const handleArrowClick = useCallback(() => {
    soundsController.playSoundEffect(SoundEffect.whooshSecondary);

    rootAnimationControls.start({
      visibility: 'visible',
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_DURATION_IN_SECONDS,
      },
    });

    arrowAnimationControls.start({
      visibility: 'hidden',
      opacity: 0,
      y: '-100%',
      x: '-50%',
      transition: {
        duration: ANIMATION_DURATION_IN_SECONDS,
      },
    });
  }, [rootAnimationControls, arrowAnimationControls]);

  return (
    <div className={classNames.root}>
      <motion.div
        className={classNames.content}
        animate={rootAnimationControls}
        onClick={handleContentClick}
      >
        { children }
      </motion.div>
      <motion.div
        className={classNames.collapseButton}
        animate={arrowAnimationControls}
        onClick={handleArrowClick}
      >
        <img
          className={classNames.collapseButtonImage}
          src={collapseImage}
          alt=""
        />
      </motion.div>
    </div>
  );
};

export const Collapsible = styled<ICollapsibleProps, ICollapsibleStyleProps, ICollapsibleStyles>(
  CollapsibleBase,
  getStyles,
);
