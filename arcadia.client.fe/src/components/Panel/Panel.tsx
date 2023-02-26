import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { AnimatePresence, motion, Variant } from 'framer-motion';
import { Overlay } from '../Overlay/Overlay';
import { Time } from '../../styles/constants';
import { useDidUpdateEffect } from '../../hooks/useDidUpdateEffect';
import { SoundsController } from '../../services/sounds/controller';
import { SoundEffect } from '../../services/sounds/types';
import {
  getClassNames, getStyles, IPanelStyleProps, IPanelStyles,
} from './styles/Panel';

enum AnimationKeys {
  isOpen = 'isOpen',
  isClosed = 'isClosed',
}

const animationVariants: { [key in AnimationKeys]: Variant } = {
  [AnimationKeys.isOpen]: { x: 0 },
  [AnimationKeys.isClosed]: { x: '-100%' },
};

const transition = { ease: 'linear', duration: Time.defaultAnimationTime };

export interface IPanelProps extends Partial<IPanelStyleProps> {
  styles?: IStyleFunctionOrObject<IPanelStyleProps, IPanelStyles>;
  isOpen?: boolean;
  onClose?: () => void;
}

const PanelBase: React.FC<IPanelProps> = ({
  styles, className, isOpen, children, onClose,
}) => {
  useDidUpdateEffect(() => {
    SoundsController.getInstance().playSoundEffect(SoundEffect.whooshSecondary);
  }, [isOpen]);

  const classNames = getClassNames(styles, { className });

  return (
    <>
      <Overlay
        isVisible={isOpen}
        onClick={onClose}
      />
      <AnimatePresence>
        { isOpen && (
          <motion.div
            className={classNames.panel}
            variants={animationVariants}
            initial={AnimationKeys.isClosed}
            animate={AnimationKeys.isOpen}
            exit={AnimationKeys.isClosed}
            transition={transition}
          >
            { children }
          </motion.div>
        ) }
      </AnimatePresence>
    </>
  );
};

export const Panel = styled<IPanelProps, IPanelStyleProps, IPanelStyles>(
  PanelBase,
  getStyles,
);
