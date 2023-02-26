import React, {
  HTMLAttributes, useCallback, useState, useImperativeHandle, RefObject, useRef, useEffect,
} from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import {
  getClassNames, getStyles, IButtonStyleProps, IButtonStyles,
} from './styles/Button';

export interface IButtonImperativeHandleRef {
  triggerMouseDown: () => void;
  triggerMouseUp: () => void;
}

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement>, Partial<IButtonStyleProps> {
  styles?: IStyleFunctionOrObject<IButtonStyleProps, IButtonStyles>;
  normalImg: string;
  pressedImg?: string;
  disabledImg?: string;
  imperativeHandleRef?: RefObject<IButtonImperativeHandleRef>;
  onChangeIsPressed?: (isPressed: boolean) => void;
  e2eSelector?: string;
}

const ButtonBase: React.FC<IButtonProps> = ({
  styles,
  className,
  classNameContent,
  isDisabled,
  normalImg,
  pressedImg,
  disabledImg,
  onTouchStart,
  onTouchEnd,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onContextMenu,
  onChangeIsPressed,
  imperativeHandleRef,
  children,
  e2eSelector,
  ...restProps
}) => {
  const isTouchStartOrDownHandled = useRef(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    isTouchStartOrDownHandled.current = true;
    setIsPressed(true);

    if (onTouchStart) {
      onTouchStart(event);
    }
  }, [onTouchStart]);

  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    isTouchStartOrDownHandled.current = true;
    setIsPressed(false);

    if (onTouchEnd) {
      onTouchEnd(event);
    }
  }, [onTouchEnd]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (isTouchStartOrDownHandled.current) {
      return;
    }

    setIsPressed(true);

    if (onMouseDown) {
      onMouseDown(event);
    }
  }, [onMouseDown]);

  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (isTouchStartOrDownHandled.current) {
      isTouchStartOrDownHandled.current = false;

      return;
    }

    setIsPressed(false);

    if (onMouseUp) {
      onMouseUp(event);
    }
  }, [onMouseUp]);

  const handleMouseLeave = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);

    if (onMouseLeave) {
      onMouseLeave(event);
    }
  }, [onMouseLeave]);

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (onContextMenu) {
      onContextMenu(event);
    }
  }, [onContextMenu]);

  useImperativeHandle(
    imperativeHandleRef,
    () => ({
      triggerMouseDown() {
        const event = new MouseEvent('mousedown');

        // @ts-ignore
        handleMouseDown(event);
      },
      triggerMouseUp() {
        const event = new MouseEvent('mouseup');

        // @ts-ignore
        handleMouseUp(event);
      },
    }),
  );

  useEffect(() => {
    if (onChangeIsPressed) {
      onChangeIsPressed(isPressed);
    }
  }, [isPressed, onChangeIsPressed]);

  const classNames = getClassNames(styles, {
    className,
    classNameContent,
    isPressed,
    isDisabled,
    isWithPressedAsset: !!pressedImg,
    isWithDisabledAsset: !!disabledImg,
  });

  return (
    <button
      className={classNames.root}
      data-e2e-selector={e2eSelector}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      {...restProps}
    >
      <img
        className={classNames.normalImg}
        src={normalImg}
        alt=""
      />
      { pressedImg && (
        <img
          className={classNames.pressedImg}
          src={pressedImg}
          alt=""
        />
      ) }
      { disabledImg && (
        <img
          className={classNames.disabledImg}
          src={disabledImg}
          alt=""
        />
      ) }
      <div className={classNames.content}>
        { children }
      </div>
    </button>
  );
};

export const Button = React.memo(
  styled<
    IButtonProps,
    IButtonStyleProps,
    IButtonStyles
  >(
    ButtonBase,
    getStyles,
  ),
);
