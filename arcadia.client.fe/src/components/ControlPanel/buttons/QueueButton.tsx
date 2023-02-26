import React from 'react';
import { Button, IButtonProps } from '../../Button/Button';
import imgBtnQueue from '../../../assets/images/buttonQueue.png';
import imgBtnQueuePressed from '../../../assets/images/buttonQueuePressed.png';

export interface IQueueButtonProps extends Partial<IButtonProps> {
}

export const QueueButtonBase: React.FC<IQueueButtonProps> = (props) => (
  <Button
    normalImg={imgBtnQueue}
    pressedImg={imgBtnQueuePressed}
    e2eSelector="queue-button"
    {...props}
  />
);

export const QueueButton = React.memo(QueueButtonBase);
