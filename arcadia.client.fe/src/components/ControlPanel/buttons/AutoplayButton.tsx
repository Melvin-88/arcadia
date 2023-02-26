import React from 'react';
import { Button, IButtonProps } from '../../Button/Button';
import imgBtnAutoplay from '../../../assets/images/buttonAutoplay.png';
import imgBtnAutoplayPressed from '../../../assets/images/buttonAutoplayPressed.png';
import imgBtnAutoplayDisabled from '../../../assets/images/buttonAutoplayDisabled.png';

export interface IAutoplayButtonProps extends Omit<IButtonProps, 'normalImg' | 'pressedImg' | 'disabledImg'> {
}

export const AutoplayButtonBase: React.FC<IAutoplayButtonProps> = (props) => (
  <Button
    normalImg={imgBtnAutoplay}
    pressedImg={imgBtnAutoplayPressed}
    disabledImg={imgBtnAutoplayDisabled}
    e2eSelector="autoplay-button"
    {...props}
  />
);

export const AutoplayButton = React.memo(AutoplayButtonBase);
