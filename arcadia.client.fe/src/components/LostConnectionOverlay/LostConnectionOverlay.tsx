import React from 'react';
import { useTranslation } from 'react-i18next';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Overlay, IOverlayProps } from '../Overlay/Overlay';
import { OverlayBackdropColor } from '../Overlay/styles/Overlay.styles';
import {
  getClassNames,
  getStyles,
  ILostConnectionOverlayStyleProps,
  ILostConnectionOverlayStyles,
} from './styles/LostConnectionOverlay';

interface ILostConnectionProps extends Pick<IOverlayProps, 'isVisible'> {
  styles?: IStyleFunctionOrObject<ILostConnectionOverlayStyleProps, ILostConnectionOverlayStyles>;
}

const LostConnectionOverlayBase: React.FC<ILostConnectionProps> = ({ styles, isVisible }) => {
  const { t } = useTranslation();

  const classNames = getClassNames(styles);

  return (
    <Overlay
      isVisible={isVisible}
      overlayBackdropColor={OverlayBackdropColor.primarySolid}
    >
      <h1 className={classNames.title}>{t('LostConnectionOverlay.Text')}</h1>
    </Overlay>
  );
};

export const LostConnectionOverlay = styled<ILostConnectionProps, ILostConnectionOverlayStyleProps, ILostConnectionOverlayStyles>(
  LostConnectionOverlayBase,
  getStyles,
);
