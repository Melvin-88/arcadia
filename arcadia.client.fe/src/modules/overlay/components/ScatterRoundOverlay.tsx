import React, { useCallback, useRef } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { IOverlayProps, Overlay } from '../../../components/Overlay/Overlay';
import { SoundsController } from '../../../services/sounds/controller';
import { GameEventSound } from '../../../services/sounds/types';
import { ISpineAnimationImperativeHandleRef, SpineAnimation } from '../../../components/SpineAnimation/SpineAnimation';
import { OverlayBackdropColor } from '../../../components/Overlay/styles/Overlay.styles';
import {
  getClassNames,
  getStyles,
  IScatterRoundOverlayStyleProps,
  IScatterRoundOverlayStyles,
} from './styles/ScatterRoundOverlay';

const ANIMATION_SKELETON_NAME = 'Scatter';

enum AnimationName {
  pfrScatterIn = 'PFRScatterIn',
  pfrScatterLoop = 'PFRScatterLoop',
  pfrScatterOut = 'PFRScatterOut',
  youWonScatterIn = 'YouWonScatterIn',
  youWonScatterLoop = 'YouWonScatterLoop',
  youWonScatterOut = 'YouWonScatterOut',
}

export enum ScatterRoundOverlayType {
  won,
  play,
}

export interface IScatterRoundOverlayProps extends Omit<IOverlayProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IScatterRoundOverlayStyleProps, IScatterRoundOverlayStyles>;
  type: ScatterRoundOverlayType;
  onClose: () => void;
}

const ScatterRoundOverlayBase: React.FC<IScatterRoundOverlayProps> = ({
  styles, type, isVisible, onClose, ...restProps
}) => {
  const animationRef = useRef<ISpineAnimationImperativeHandleRef>(null);
  const soundsController = SoundsController.getInstance();

  const handleAnimationLoadComplete = useCallback(() => {
    if (!animationRef.current || !isVisible) {
      return;
    }

    if (type === ScatterRoundOverlayType.won) {
      soundsController.playGameEventSound(GameEventSound.scatterRoundWin);
      animationRef.current.addAnimation(0, AnimationName.youWonScatterIn, false, 0);
      animationRef.current.addAnimation(0, AnimationName.youWonScatterLoop, false, 0);
      animationRef.current.addAnimation(0, AnimationName.youWonScatterOut, false, 0);
    } else {
      soundsController.playGameEventSound(GameEventSound.scatterRoundStart);
      animationRef.current.addAnimation(0, AnimationName.pfrScatterIn, false, 0);
      animationRef.current.addAnimation(0, AnimationName.pfrScatterLoop, false, 0);
      animationRef.current.addAnimation(0, AnimationName.pfrScatterOut, false, 0);
    }
  }, [animationRef.current, type, isVisible, soundsController]);

  const handleAnimationComplete = useCallback((track: spine.TrackEntry) => {
    const completeAnimationName = type === ScatterRoundOverlayType.won ? AnimationName.youWonScatterOut : AnimationName.pfrScatterOut;

    if (track.animation.name === completeAnimationName) {
      onClose();
    }
  }, [type, isVisible, onClose]);

  const classNames = getClassNames(styles);

  return (
    <Overlay
      classNameContent={classNames.content}
      overlayBackdropColor={OverlayBackdropColor.secondary}
      isVisible={isVisible}
      {...restProps}
    >
      <SpineAnimation
        imperativeHandleRef={animationRef}
        className={classNames.animation}
        skeletonName={ANIMATION_SKELETON_NAME}
        onLoadComplete={handleAnimationLoadComplete}
        onAnimationComplete={handleAnimationComplete}
      />
    </Overlay>
  );
};

export const ScatterRoundOverlay = styled<IScatterRoundOverlayProps, IScatterRoundOverlayStyleProps, IScatterRoundOverlayStyles>(
  ScatterRoundOverlayBase,
  getStyles,
);
