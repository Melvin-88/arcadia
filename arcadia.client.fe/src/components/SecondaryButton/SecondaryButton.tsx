import React, { MouseEvent, useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Button, IButtonProps } from '../Button/Button';
import { SoundsController } from '../../services/sounds/controller';
import { ButtonSound } from '../../services/sounds/types';
import imgBtnSecondary from '../../assets/images/buttonSecondary.png';
import imgBtnSecondaryPressed from '../../assets/images/buttonSecondaryPressed.png';
import {
  ISecondaryButtonStyleProps, ISecondaryButtonStyles, getClassNames, getStyles,
} from './styles/SecondaryButton';

export interface ISecondaryButtonProps extends Partial<IButtonProps> {
  styles?: IStyleFunctionOrObject<ISecondaryButtonStyleProps, ISecondaryButtonStyles>;
}

const SecondaryButtonBase: React.FC<ISecondaryButtonProps> = ({
  styles, className, onClick, ...restProps
}) => {
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    SoundsController.getInstance().playButtonSound(ButtonSound.primary);

    if (onClick) {
      onClick(event);
    }
  }, [onClick]);

  const classNames = getClassNames(styles, { className });

  return (
    <Button
      className={classNames.root}
      normalImg={imgBtnSecondary}
      pressedImg={imgBtnSecondaryPressed}
      e2eSelector="secondary-button"
      onClick={handleClick}
      {...restProps}
    />
  );
};

export const SecondaryButton = styled<ISecondaryButtonProps, ISecondaryButtonStyleProps, ISecondaryButtonStyles>(
  SecondaryButtonBase,
  getStyles,
);
