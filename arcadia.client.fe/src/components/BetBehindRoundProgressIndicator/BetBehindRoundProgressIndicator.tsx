import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { IProgressIndicatorProps, ProgressIndicator } from '../ProgressIndicator/ProgressIndicator';
import imgBetBehind from '../../assets/images/betBehind.png';
import { TextFit } from '../TextFit/TextFit';
import { Color } from '../../styles/constants';
import {
  getClassNames, getStyles, IBetBehindRoundProgressIndicatorStyleProps, IBetBehindRoundProgressIndicatorStyles,
} from './styles/BetBehindRoundProgressIndicator';

export interface IBetBehindRoundProgressIndicatorProps extends Omit<IProgressIndicatorProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IBetBehindRoundProgressIndicatorStyleProps, IBetBehindRoundProgressIndicatorStyles>;
  coins: number;
  stackSize: number;
}

const BetBehindRoundProgressIndicatorBase: React.FC<IBetBehindRoundProgressIndicatorProps> = ({
  styles,
  coins,
  stackSize,
  ...restProps
}) => {
  const isEmptyState = !coins;

  const classNames = getClassNames(styles);

  return (
    <ProgressIndicator
      classNameContent={classNames.progressIndicatorContent}
      progress={isEmptyState ? 1 : coins / stackSize}
      circleColor={isEmptyState ? Color.progressIndicator.emptyCircleColor : Color.betBehindRoundProgressIndicator.roundColor}
      {...restProps}
    >
      <img
        className={classNames.betBehindImg}
        src={imgBetBehind}
        alt=""
      />
      <TextFit
        className={classNames.amount}
        mode="single"
        forceSingleModeWidth={false}
      >
        { coins }
      </TextFit>
    </ProgressIndicator>
  );
};

export const BetBehindRoundProgressIndicator = React.memo(
  styled<
    IBetBehindRoundProgressIndicatorProps,
    IBetBehindRoundProgressIndicatorStyleProps,
    IBetBehindRoundProgressIndicatorStyles
  >(
    BetBehindRoundProgressIndicatorBase,
    getStyles,
  ),
);
