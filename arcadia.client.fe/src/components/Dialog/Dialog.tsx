import React from 'react';
import ReactDOM from 'react-dom';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Overlay } from '../Overlay/Overlay';
import { CloseButton } from '../CloseButton/CloseButton';
import { Card } from '../Card/Card';
import { BackgroundRays } from './BackgroundRays';
import { useDidUpdateEffect } from '../../hooks/useDidUpdateEffect';
import { SoundsController } from '../../services/sounds/controller';
import { SoundEffect } from '../../services/sounds/types';
import { APP_CONTAINER_ID } from '../AppLayout/AppLayout';
import {
  getClassNames, getStyles, IDialogStyleProps, IDialogStyles,
} from './styles/Dialog.styles';

export interface IDialogProps extends Partial<IDialogStyleProps> {
  styles?: IStyleFunctionOrObject<IDialogStyleProps, IDialogStyles>;
  title?: string;
  withRays?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const DialogBase: React.FC<IDialogProps> = ({
  styles,
  classNameCard,
  classNameContainer,
  title,
  withRays,
  isOpen,
  children,
  onClose,
}) => {
  useDidUpdateEffect(() => {
    SoundsController.getInstance().playSoundEffect(SoundEffect.dialogOpenToggle);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const classNames = getClassNames(styles, { classNameContainer, classNameCard });

  return ReactDOM.createPortal((
    <Overlay className={classNames.overlay} isVisible={isOpen} onClick={onClose}>
      <Card
        className={classNames.card}
      >
        {withRays && <BackgroundRays />}
        <div className={classNames.container}>
          <CloseButton
            className={classNames.headerBtn}
            onClick={onClose}
          />
          {title && (
            <div className={classNames.title}>
              { title }
            </div>
          )}
          <div>
            { children }
          </div>
        </div>
      </Card>
    </Overlay>
  ), document.getElementById(APP_CONTAINER_ID) || document.body);
};

export const Dialog = styled<IDialogProps, IDialogStyleProps, IDialogStyles>(
  DialogBase,
  getStyles,
);
