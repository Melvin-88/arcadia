import { IRawStyle, IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { FontFamily } from '../../../styles/constants';

export interface IButtonStyleProps {
  className?: string;
  classNameContent?: string;
  isDisabled?: boolean;
  isPressed?: boolean;
  isWithPressedAsset?: boolean;
  isWithDisabledAsset?: boolean;
}

export interface IButtonStyles {
  root: IStyle;
  normalImg: IStyle;
  pressedImg: IStyle;
  disabledImg: IStyle;
  content: IStyle;
}

const baseStateImgStyles: IRawStyle = {
  display: 'block',
  position: 'absolute',
  width: '100%',
  left: 0,
  bottom: 0,
  opacity: 0,
};

export const getStyles = ({
  className, classNameContent, isPressed, isDisabled, isWithPressedAsset, isWithDisabledAsset,
}: IButtonStyleProps): IButtonStyles => ({
  root: [
    {
      position: 'relative',
      display: 'inline-block',
      width: '100%',
      appearance: 'none',
      background: 'none',
      border: 'none',
      outline: 'none',
      userSelect: 'none',
      padding: 0,
      cursor: 'pointer',
      '-webkit-tap-highlight-color': 'transparent',
    },
    isPressed && !isWithPressedAsset && {
      filter: 'contrast(125%) brightness(103%)',
    },
    isDisabled && {
      pointerEvents: 'none',
    },
    isDisabled && !isWithDisabledAsset && {
      filter: 'grayscale(100%)',
    },
    className,
  ],
  normalImg: [
    {
      display: 'block',
      width: '100%',
    },
    isPressed && isWithPressedAsset && {
      opacity: 0,
    },
  ],
  pressedImg: [
    baseStateImgStyles,
    isPressed && {
      opacity: 1,
    },
  ],
  disabledImg: [
    baseStateImgStyles,
    isDisabled && {
      opacity: 1,
    },
  ],
  content: [
    {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      padding: '2.7rem 2.5rem 4rem',
      fontFamily: FontFamily.secondary,
      textTransform: 'uppercase',
    },
    classNameContent,
  ],
});

export const getClassNames = classNamesFunction<IButtonStyleProps, IButtonStyles>();
