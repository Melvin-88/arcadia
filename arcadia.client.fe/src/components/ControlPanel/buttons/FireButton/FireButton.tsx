import React, { useCallback, useEffect, useRef } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Button, IButtonImperativeHandleRef, IButtonProps } from '../../../Button/Button';
import imgBtnFire from '../../../../assets/images/buttonFire.png';
import imgBtnFirePressed from '../../../../assets/images/buttonFirePressed.png';
import imgFreeBadge from '../../../../assets/images/freeBadge.png';
import {
  getClassNames, getStyles, IFireButtonStyleProps, IFireButtonStyles,
} from './styles/FireButton';

export interface IFireButtonProps extends Partial<Omit<IButtonProps, 'styles'>> {
  styles?: IStyleFunctionOrObject<IFireButtonStyleProps, IFireButtonStyles>;
  isFree?: boolean;
}

let isSpacePressed = false;

const FireButtonBase: React.FC<IFireButtonProps> = ({
  styles, isFree, children, ...restProps
}) => {
  const buttonRef = useRef<IButtonImperativeHandleRef>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space' && !isSpacePressed) {
      isSpacePressed = true;
      buttonRef?.current?.triggerMouseDown();
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      isSpacePressed = false;
      buttonRef?.current?.triggerMouseUp();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const classNames = getClassNames(styles);

  return (
    <Button
      imperativeHandleRef={buttonRef}
      normalImg={imgBtnFire}
      pressedImg={imgBtnFirePressed}
      e2eSelector="fire-button"
      {...restProps}
    >
      { children }
      { isFree && (
        <img
          className={classNames.freeBadge}
          src={imgFreeBadge}
          alt=""
        />
      ) }
    </Button>
  );
};

export const FireButton = React.memo(
  styled<
    IFireButtonProps,
    IFireButtonStyleProps,
    IFireButtonStyles
  >(
    FireButtonBase,
    getStyles,
  ),
);
