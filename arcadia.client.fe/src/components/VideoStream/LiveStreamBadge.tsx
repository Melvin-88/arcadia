import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import {
  getClassNames, getStyles, ILiveStreamBadgeStyleProps, ILiveStreamBadgeStyles,
} from './styles/LiveStreamBadge';

export interface ILiveStreamBadgeProps extends Partial<ILiveStreamBadgeStyleProps> {
  styles?: IStyleFunctionOrObject<ILiveStreamBadgeStyleProps, ILiveStreamBadgeStyles>;
}

const LiveStreamBadgeBase: React.FC<ILiveStreamBadgeProps> = ({
  styles, className,
}) => {
  const classNames = getClassNames(styles, {
    className,
  });

  return (
    <div className={classNames.root}>
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.07 334.94">
        <g opacity=".65">
          <path
            className={classNames.path2}
            // eslint-disable-next-line max-len
            d="M609.76 73.8a32.06 32.06 0 00-6.93.77 25.89 25.89 0 00-8.42 3.33L527.53 115l-10.4 5.77v110.35l10.4 5.73 67.38 37.09a30.33 30.33 0 0014.94 3.95 30 30 0 0025.68-14.41 28.21 28.21 0 004-14.28v-147c-.04-15.5-13.42-28.4-29.77-28.4zM446.33 38.38H84.62a51.35 51.35 0 00-51.2 51.2v172.54a51.35 51.35 0 0051.2 51.2h361.71a51.35 51.35 0 0051.2-51.2V89.58a51 51 0 00-51.2-51.2z"
            transform="translate(-3.42 -8.38)"
          />
          <path
            className={classNames.path3}
            // eslint-disable-next-line max-len
            d="M609.76 43.8a62 62 0 00-12.64 1.31 54.82 54.82 0 00-17.44 6.66l-52.61 29.15a81 81 0 00-80.74-72.54H84.62a81.29 81.29 0 00-81.2 81.2v172.54a81.3 81.3 0 0081.2 81.2h361.71a81.31 81.31 0 0080.72-72.49l53.29 29.34a60.1 60.1 0 0080.8-21.07l.18-.3.18-.3a57.91 57.91 0 008-29.3v-147c-.01-32.2-26.8-58.4-59.74-58.4zm29.73 205.4a28.21 28.21 0 01-4 14.28 30 30 0 01-25.68 14.41 30.33 30.33 0 01-14.94-3.95l-67.38-37.09-10.4-5.73V120.73l10.4-5.77 66.92-37.06a25.89 25.89 0 018.42-3.33 32.06 32.06 0 016.93-.77c16.35 0 29.73 12.9 29.73 28.37zm-193.16 64.12H84.62a51.35 51.35 0 01-51.2-51.2V89.58a51.35 51.35 0 0151.2-51.2h361.71a51 51 0 0151.2 51.2v172.54a51.35 51.35 0 01-51.2 51.2z"
            transform="translate(-3.42 -8.38)"
          />
          <path
            className={classNames.path3}
            // eslint-disable-next-line max-len
            d="M115.75 238.43V110.21h25.45v100.13h43.72v28.09zM200 238.43V110.21h25.45v128.22zM289.48 238.43h-19L236.1 110.21h26.47l17.55 71.67 17.26-71.67H324zM334.52 238.43V110.21h70.63v28.09H360v21.43h38.6v28.1H360v22.51h45.18v28.09z"
            transform="translate(-3.42 -8.38)"
          />
          <circle className={classNames.path4} cx="430.41" cy="86.11" r="15.27" />
        </g>
      </svg>
    </div>
  );
};

export const LiveStreamBadge = React.memo(
  styled<
    ILiveStreamBadgeProps,
    ILiveStreamBadgeStyleProps,
    ILiveStreamBadgeStyles
  >(
    LiveStreamBadgeBase,
    getStyles,
  ),
);
