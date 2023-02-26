import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Button, IButtonProps } from '../../../Button/Button';
import imgBtnStop from '../../../../assets/images/buttonStop.png';
import imgBtnStopPressed from '../../../../assets/images/buttonStopPressed.png';
import imgAutoBadge from '../../../../assets/images/autoBadge.png';
import imgFreeBadge from '../../../../assets/images/freeBadge.png';
import {
  getClassNames, getStyles, IStopButtonStyleProps, IStopButtonStyles,
} from './styles/StopButton';

export interface IStopButtonProps extends Partial<Omit<IButtonProps, 'styles'>> {
  styles?: IStyleFunctionOrObject<IStopButtonStyleProps, IStopButtonStyles>;
  isFree?: boolean;
}

const StopButtonBase: React.FC<IStopButtonProps> = ({
  styles, isFree, children, ...restProps
}) => {
  const classNames = getClassNames(styles);

  return (
    <Button
      normalImg={imgBtnStop}
      pressedImg={imgBtnStopPressed}
      e2eSelector="autoplay-stop-button"
      {...restProps}
    >
      { children }
      { isFree ? (
        <img
          className={classNames.badge}
          src={imgFreeBadge}
          alt=""
        />
      ) : (
        <img
          className={classNames.badge}
          src={imgAutoBadge}
          alt=""
        />
      ) }
    </Button>
  );
};

export const StopButton = React.memo(
  styled<
    IStopButtonProps,
    IStopButtonStyleProps,
    IStopButtonStyles
  >(
    StopButtonBase,
    getStyles,
  ),
);
