import React, { MouseEvent, useCallback } from 'react';
import { Button, IButtonProps } from '../Button/Button';
import { SoundsController } from '../../services/sounds/controller';
import { ButtonSound } from '../../services/sounds/types';
import imgBtnClose from '../../assets/images/buttonClose.png';

export interface ICloseButtonProps extends Partial<IButtonProps> {
}

const CloseButtonBase: React.FC<ICloseButtonProps> = ({ onClick, ...restProps }) => {
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    SoundsController.getInstance().playButtonSound(ButtonSound.secondary);

    if (onClick) {
      onClick(event);
    }
  }, [onClick]);

  return (
    <Button
      normalImg={imgBtnClose}
      e2eSelector="close-button"
      onClick={handleClick}
      {...restProps}
    />
  );
};

export const CloseButton = React.memo(CloseButtonBase);
