import React from 'react';
import { useTranslation } from 'react-i18next';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Overlay } from '../Overlay/Overlay';
import { OverlayBackdropColor } from '../Overlay/styles/Overlay.styles';
import {
  getClassNames, getStyles, IExitStyleProps, IExitStyles,
} from './styles/Exit';

interface IExitProps extends Partial<IExitStyleProps> {
  styles?: IStyleFunctionOrObject<IExitStyleProps, IExitStyles>;
}

const Exit: React.FC<IExitProps> = ({ styles }) => {
  const { t } = useTranslation();

  const classNames = getClassNames(styles);

  return (
    <Overlay
      overlayBackdropColor={OverlayBackdropColor.primarySolid}
      isVisible
    >
      <h1 className={classNames.title}>{t('Exit.Title')}</h1>
    </Overlay>
  );
};

export default styled<IExitProps, IExitStyleProps, IExitStyles>(
  Exit,
  getStyles,
);
