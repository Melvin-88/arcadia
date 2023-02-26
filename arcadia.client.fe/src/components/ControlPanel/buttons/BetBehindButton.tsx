import React from 'react';
import { Button, IButtonProps } from '../../Button/Button';
import imgBtnBetBehind from '../../../assets/images/buttonBetBehind.png';
import imgBtnBetBehindPressed from '../../../assets/images/buttonBetBehindPressed.png';

export interface IBetBehindButton extends Partial<IButtonProps> {
}

export const BetBehindButtonBase: React.FC<IBetBehindButton> = (props) => (
  <Button
    normalImg={imgBtnBetBehind}
    pressedImg={imgBtnBetBehindPressed}
    e2eSelector="bet-behind-button"
    {...props}
  />
);

export const BetBehindButton = React.memo(BetBehindButtonBase);
