import React from 'react';
import { Button, IButtonProps } from '../../Button/Button';
import imgBtnAutoswing from '../../../assets/images/buttonAutoswing.png';
import imgBtnAutoswingPressed from '../../../assets/images/buttonAutoswingPressed.png';
import imgBtnAutoswingDisabled from '../../../assets/images/buttonAutoswingDisabled.png';

export interface IAutoswingButtonProps extends Omit<IButtonProps, 'normalImg' | 'pressedImg' | 'disabledImg'> {
}

export const AutoswingButtonBase: React.FC<IAutoswingButtonProps> = (props) => (
  <Button
    normalImg={imgBtnAutoswing}
    pressedImg={imgBtnAutoswingPressed}
    disabledImg={imgBtnAutoswingDisabled}
    e2eSelector="autoswing-button"
    {...props}
  />
);

export const AutoswingButton = React.memo(AutoswingButtonBase);
