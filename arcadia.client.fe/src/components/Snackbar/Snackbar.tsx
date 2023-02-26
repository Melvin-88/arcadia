import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { AnimatePresence, motion, Variant } from 'framer-motion';
import { CloseButton } from '../CloseButton/CloseButton';
import { Time } from '../../styles/constants';
import { SoundsController } from '../../services/sounds/controller';
import { SoundEffect } from '../../services/sounds/types';
import { useDidUpdateEffect } from '../../hooks/useDidUpdateEffect';
import {
  getClassNames, getStyles, ISnackbarStyleProps, ISnackbarStyles,
} from './styles/Snackbar';

enum AnimationKeys {
  isOpen = 'isOpen',
  isClosed = 'isClosed',
}

const animationVariants: { [key in AnimationKeys]: Variant } = {
  [AnimationKeys.isOpen]: { y: 0 },
  [AnimationKeys.isClosed]: { y: '100%' },
};

const transition = { ease: 'linear', duration: Time.defaultAnimationTime };

export interface ISnackbarProps extends Partial<ISnackbarStyleProps> {
  styles?: IStyleFunctionOrObject<ISnackbarStyleProps, ISnackbarStyles>;
  isOpen?: boolean;
  headerContent?: React.ReactNode;
  onClose?: () => void;
  e2eSelector?: string;
}

const SnackbarBase: React.FC<ISnackbarProps> = ({
  styles, className, classNameHeader, isOpen, headerContent, children, e2eSelector, onClose,
}) => {
  useDidUpdateEffect(() => {
    SoundsController.getInstance().playSoundEffect(SoundEffect.whooshSecondary);
  }, [isOpen]);

  const classNames = getClassNames(styles, {
    className,
    classNameHeader,
  });

  return (
    <AnimatePresence>
      { isOpen && (
        <motion.div
          className={classNames.root}
          variants={animationVariants}
          initial={AnimationKeys.isClosed}
          animate={AnimationKeys.isOpen}
          exit={AnimationKeys.isClosed}
          transition={transition}
          data-e2e-selector={e2eSelector}
        >
          <div className={classNames.header}>
            { headerContent }
            <CloseButton
              className={classNames.closeBtn}
              onClick={onClose}
            />
          </div>
          { children }
        </motion.div>
      ) }
    </AnimatePresence>
  );
};

export const Snackbar = styled<ISnackbarProps, ISnackbarStyleProps, ISnackbarStyles>(
  SnackbarBase,
  getStyles,
);
