import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Overlay, IOverlayProps } from '../../Overlay/Overlay';
import { StarSpinner } from '../StarSpinner/StarSpinner';
import {
  getStyles,
  ILoadingOverlayStyles,
  ILoadingOverlayStyleProps,
  getClassNames,
} from './styles/LoadingOverlay.styles';

export interface ILoadingOverlayProps extends Partial<ILoadingOverlayStyleProps>, Omit<IOverlayProps, 'styles'> {
  styles?: IStyleFunctionOrObject<ILoadingOverlayStyleProps, ILoadingOverlayStyles>;
  message?: string | null;
}

const LoadingOverlayBase: React.FC<ILoadingOverlayProps> = ({
  styles,
  message,
  className,
  e2eSelector = 'loading-overlay',
  ...restProps
}) => {
  const classNames = getClassNames(styles, {
    className,
  });

  return (
    <Overlay
      className={classNames.overlay}
      classNameContent={classNames.overlayContent}
      e2eSelector={e2eSelector}
      {...restProps}
    >
      <div className={classNames.spinnerContainer}>
        <StarSpinner />
      </div>
      <div className={classNames.message}>{message}</div>
    </Overlay>
  );
};

export const LoadingOverlay = styled<ILoadingOverlayProps, ILoadingOverlayStyleProps, ILoadingOverlayStyles>(
  LoadingOverlayBase,
  getStyles,
);
