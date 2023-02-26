import React from 'react';
import { Button, IButtonProps } from '../../Button/Button';
import imgBtnChangeBet from '../../../assets/images/buttonChangeBet.png';
import imgBtnChangeBetPressed from '../../../assets/images/buttonChangeBetPressed.png';

export interface IChangeBetButtonProps extends Partial<IButtonProps> {
}

export const ChangeBetButtonBase: React.FC<IChangeBetButtonProps> = (props) => (
  <Button
    normalImg={imgBtnChangeBet}
    pressedImg={imgBtnChangeBetPressed}
    e2eSelector="change-bet-button"
    {...props}
  />
);

export const ChangeBetButton = React.memo(ChangeBetButtonBase);
