import React from 'react';
import { AnimatePresence, motion, Variant } from 'framer-motion';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import {
  IOverlayStyleProps, IOverlayStyles, getStyles, getClassNames,
} from './styles/Overlay.styles';

export type ColorUnion = 'primary' | 'secondary';

export const OverlayColor : { [key in ColorUnion] : ColorUnion } = {
  primary: 'primary',
  secondary: 'secondary',
};

enum AnimationKeys {
  visible = 'visible',
  hidden = 'hidden',
}

const animationVariants: { [key in AnimationKeys]: Variant } = {
  [AnimationKeys.visible]: { opacity: 1 },
  [AnimationKeys.hidden]: { opacity: 0 },
};

export interface IOverlayProps extends Partial<IOverlayStyleProps> {
  styles?: IStyleFunctionOrObject<IOverlayStyleProps, IOverlayStyles>;
  color?: ColorUnion;
  isVisible?: boolean;
  onClick?: () => void;
  e2eSelector?: string;
}

const OverlayBase: React.FC<IOverlayProps> = ({
  styles,
  className,
  classNameContent,
  isVisible,
  overlayBackdropColor,
  children,
  onClick,
  e2eSelector,
}) => {
  const classNames = getClassNames(styles, {
    className,
    classNameContent,
    overlayBackdropColor,
  });

  return (
    <AnimatePresence>
      { isVisible && (
        <motion.div
          className={classNames.root}
          variants={animationVariants}
          initial={AnimationKeys.hidden}
          animate={AnimationKeys.visible}
          exit={AnimationKeys.hidden}
          data-e2e-selector={e2eSelector}
        >
          <div
            className={classNames.overlayBackdrop}
            role="presentation"
            onClick={onClick}
          />
          { children && (
            <div className={classNames.overlayContent}>
              { children }
            </div>
          ) }
        </motion.div>
      ) }
    </AnimatePresence>
  );
};

export const Overlay = styled<IOverlayProps, IOverlayStyleProps, IOverlayStyles>(
  OverlayBase,
  getStyles,
);
