import React, { useEffect } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { IOverlayProps, Overlay } from '../../../components/Overlay/Overlay';
import PlayingNowLetters from '../../../assets/svg/playingNow.svg';
import {
  getClassNames, getStyles, IPlayingNowOverlayStyleProps, IPlayingNowOverlayStyles,
} from './styles/PlayingNowOverlay';

export interface IPlayingNowOverlayProps extends Omit<IOverlayProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IPlayingNowOverlayStyleProps, IPlayingNowOverlayStyles>;
  autoCloseDelay: number;
  onClose: () => void;
}

// TODO: Extract autoClose logic to the middlewares
const PlayingNowOverlayBase: React.FC<IPlayingNowOverlayProps> = ({
  styles, autoCloseDelay, isVisible, onClose, ...restProps
}) => {
  useEffect(() => {
    let timeout: number;

    if (isVisible) {
      timeout = window.setTimeout(() => {
        onClose();
      }, autoCloseDelay);
    }

    return () => clearInterval(timeout);
  }, [isVisible, onClose]);

  const classNames = getClassNames(styles);

  return (
    <Overlay
      isVisible={isVisible}
      onClick={onClose}
      {...restProps}
    >
      <PlayingNowLetters className={classNames.letters} />
    </Overlay>
  );
};

export const PlayingNowOverlay = styled<IPlayingNowOverlayProps, IPlayingNowOverlayStyleProps, IPlayingNowOverlayStyles>(
  PlayingNowOverlayBase,
  getStyles,
);
