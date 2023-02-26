import React, { MouseEvent, useCallback } from 'react';
import { Button, IButtonProps } from '../Button/Button';
import { SoundsController } from '../../services/sounds/controller';
import { ButtonSound } from '../../services/sounds/types';
import imgBtnPlay from '../../assets/images/buttonPlay.png';

export interface IPlayButtonProps extends Partial<IButtonProps> {
}

const PlayButtonBase: React.FC<IPlayButtonProps> = ({ onClick, ...restProps }) => {
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    SoundsController.getInstance().playButtonSound(ButtonSound.primary);

    if (onClick) {
      onClick(event);
    }
  }, [onClick]);

  return (
    <Button
      normalImg={imgBtnPlay}
      e2eSelector="play-button"
      onClick={handleClick}
      {...restProps}
    />
  );
};

export const PlayButton = React.memo(PlayButtonBase);
