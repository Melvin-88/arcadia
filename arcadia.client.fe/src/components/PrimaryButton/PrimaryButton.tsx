import React, { useCallback, MouseEvent } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Button, IButtonProps } from '../Button/Button';
import { SoundsController } from '../../services/sounds/controller';
import { ButtonSound } from '../../services/sounds/types';
import imgBtnPrimary from '../../assets/images/buttonPrimary.png';
import imgBtnPrimaryPressed from '../../assets/images/buttonPrimaryPressed.png';
import {
  IPrimaryButtonStyleProps, IPrimaryButtonStyles, getClassNames, getStyles,
} from './styles/PrimaryButton';

export interface IPrimaryButtonProps extends Partial<IButtonProps> {
  styles?: IStyleFunctionOrObject<IPrimaryButtonStyleProps, IPrimaryButtonStyles>;
}

const PrimaryButtonBase: React.FC<IPrimaryButtonProps> = ({
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
      normalImg={imgBtnPrimary}
      pressedImg={imgBtnPrimaryPressed}
      e2eSelector="primary-button"
      onClick={handleClick}
      {...restProps}
    />
  );
};

export const PrimaryButton = styled<IPrimaryButtonProps, IPrimaryButtonStyleProps, IPrimaryButtonStyles>(
  PrimaryButtonBase,
  getStyles,
);
