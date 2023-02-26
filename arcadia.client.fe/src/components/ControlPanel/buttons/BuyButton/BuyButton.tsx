import React, { useCallback, useRef, useState } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Button, IButtonProps } from '../../../Button/Button';
import imgBtnBuy from '../../../../assets/images/buttonBuy.png';
import imgBtnBuyPressed from '../../../../assets/images/buttonBuyPressed.png';
import { ISpineAnimationImperativeHandleRef, SpineAnimation } from '../../../SpineAnimation/SpineAnimation';
import {
  IBuyButtonStyleProps, IBuyButtonStyles, getClassNames, getStyles,
} from './styles/BuyButton';

const ANIMATION_SKELETON_NAME = 'buyButton';

enum AnimationName {
  buttonBuyIdle = 'buttonBuyIdle',
}

export interface IBuyButtonProps extends Partial<Omit<IButtonProps, 'styles'>>, Partial<IBuyButtonStyleProps> {
  styles?: IStyleFunctionOrObject<IBuyButtonStyleProps, IBuyButtonStyles>;
}

export const BuyButtonBase: React.FC<IBuyButtonProps> = ({ styles, ...restProps }) => {
  const animationRef = useRef<ISpineAnimationImperativeHandleRef>(null);
  const [isPressed, setIsPressed] = useState(false);
  const classNames = getClassNames(styles, {
    isPressed,
  });

  const handleAnimationLoadComplete = useCallback(() => {
    animationRef.current?.setAnimation(0, AnimationName.buttonBuyIdle, true);
  }, [animationRef.current]);

  return (
    <Button
      normalImg={imgBtnBuy}
      pressedImg={imgBtnBuyPressed}
      e2eSelector="buy-button"
      onChangeIsPressed={setIsPressed}
      {...restProps}
    >
      <SpineAnimation
        imperativeHandleRef={animationRef}
        className={classNames.animation}
        skeletonName={ANIMATION_SKELETON_NAME}
        onLoadComplete={handleAnimationLoadComplete}
      />
    </Button>
  );
};

export const BuyButton = React.memo(
  styled<
    IBuyButtonProps,
    IBuyButtonStyleProps,
    IBuyButtonStyles
  >(
    BuyButtonBase,
    getStyles,
  ),
);
