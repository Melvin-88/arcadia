import React from 'react';
import imgBtnSoundOff from '../../../assets/images/buttonSoundOff.png';
import imgBtnSoundOffPressed from '../../../assets/images/buttonSoundOffPressed.png';
import imgBtnSoundOn from '../../../assets/images/buttonSoundOn.png';
import imgBtnSoundOnPressed from '../../../assets/images/buttonSoundOnPressed.png';
import { Button, IButtonProps } from '../../Button/Button';

export interface IVolumeButtonProps extends Partial<IButtonProps> {
  isAllSoundsMuted?: boolean;
}

export const VolumeButtonBase: React.FC<IVolumeButtonProps> = ({ isAllSoundsMuted, ...restProps }) => {
  if (isAllSoundsMuted) {
    return (
      <Button
        normalImg={imgBtnSoundOff}
        pressedImg={imgBtnSoundOffPressed}
        e2eSelector="mute-all-button"
        {...restProps}
      />
    );
  }

  return (
    <Button
      normalImg={imgBtnSoundOn}
      pressedImg={imgBtnSoundOnPressed}
      e2eSelector="unmute-all-button"
      {...restProps}
    />
  );
};

export const VolumeButton = React.memo(VolumeButtonBase);
