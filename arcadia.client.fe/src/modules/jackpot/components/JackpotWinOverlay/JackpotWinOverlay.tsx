import React, { useCallback, useRef } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { Overlay } from '../../../../components/Overlay/Overlay';
import {
  ISpineAnimationImperativeHandleRef,
  SpineAnimation,
} from '../../../../components/SpineAnimation/SpineAnimation';
import { OverlayBackdropColor } from '../../../../components/Overlay/styles/Overlay.styles';
import { TextFit } from '../../../../components/TextFit/TextFit';
import { jackpotSelector } from '../../state/selectors';
import { setJackpotWinData } from '../../state/actions';
import { formatCurrency } from '../../../../services/dataFormat';
import {
  getClassNames,
  getStyles,
  IJackpotWinOverlayStyleProps,
  IJackpotWinOverlayStyles,
} from './styles/JackpotWinOverlay';

const ANIMATION_SKELETON_NAME = 'jackpot';

enum AnimationName {
  jackpotIn = 'jackpotIn',
  jackpotLoop = 'jackpotLoop',
  jackpotOut = 'jackpotOut',
}

export interface IJackpotWinOverlayProps {
  styles?: IStyleFunctionOrObject<IJackpotWinOverlayStyleProps, IJackpotWinOverlayStyles>;
}

const JackpotWinOverlayBase: React.FC<IJackpotWinOverlayProps> = ({ styles }) => {
  const dispatch = useDispatch();
  const { winData } = useSelector(jackpotSelector);

  const animationRef = useRef<ISpineAnimationImperativeHandleRef>(null);

  const isVisible = !!winData;

  const handleAnimationLoadComplete = useCallback(() => {
    if (animationRef.current && isVisible) {
      animationRef.current.addAnimation(0, AnimationName.jackpotIn, false, 0);
      animationRef.current.addAnimation(0, AnimationName.jackpotLoop, false, 0);
      animationRef.current.addAnimation(0, AnimationName.jackpotLoop, false, 0);
      animationRef.current.addAnimation(0, AnimationName.jackpotLoop, false, 0);
      animationRef.current.addAnimation(0, AnimationName.jackpotOut, false, 0);
    }
  }, [animationRef.current, isVisible]);

  const handleAnimationComplete = useCallback((track: spine.TrackEntry) => {
    if (track.animation.name === AnimationName.jackpotOut) {
      dispatch(setJackpotWinData(null));
    }
  }, []);

  const classNames = getClassNames(styles);

  return (
    <Overlay
      classNameContent={classNames.content}
      overlayBackdropColor={OverlayBackdropColor.secondary}
      isVisible={isVisible}
    >
      <SpineAnimation
        className={classNames.animation}
        imperativeHandleRef={animationRef}
        skeletonName={ANIMATION_SKELETON_NAME}
        onLoadComplete={handleAnimationLoadComplete}
        onAnimationComplete={handleAnimationComplete}
      />
      { winData && (
        <TextFit className={classNames.amount} forceSingleModeWidth={false}>
          { formatCurrency(winData.amount, { currency: winData.currency, minimumFractionDigits: 0 }) }
        </TextFit>
      ) }
    </Overlay>
  );
};

export const JackpotWinOverlay = styled<IJackpotWinOverlayProps, IJackpotWinOverlayStyleProps, IJackpotWinOverlayStyles>(
  JackpotWinOverlayBase,
  getStyles,
);
