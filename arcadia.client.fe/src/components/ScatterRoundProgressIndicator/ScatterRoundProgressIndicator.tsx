import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { IProgressIndicatorProps, ProgressIndicator } from '../ProgressIndicator/ProgressIndicator';
import imgScatterFree from '../../assets/images/scatterFree.png';
import { Color } from '../../styles/constants';
import {
  getClassNames, getStyles, IScatterRoundProgressIndicatorStyleProps, IScatterRoundProgressIndicatorStyles,
} from './styles/ScatterRoundProgressIndicator';

export interface IScatterRoundProgressIndicatorProps extends Omit<IProgressIndicatorProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IScatterRoundProgressIndicatorStyleProps, IScatterRoundProgressIndicatorStyles>;
  coins: number;
  stackSize: number;
}

const ScatterRoundProgressIndicatorBase: React.FC<IScatterRoundProgressIndicatorProps> = ({
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
      circleColor={isEmptyState ? Color.progressIndicator.emptyCircleColor : Color.scatterRoundProgressIndicator.roundColor}
      {...restProps}
    >
      <img
        className={classNames.scatterImg}
        src={imgScatterFree}
        alt=""
      />
    </ProgressIndicator>
  );
};

export const ScatterRoundProgressIndicator = styled<IScatterRoundProgressIndicatorProps, IScatterRoundProgressIndicatorStyleProps,
  IScatterRoundProgressIndicatorStyles>(
    ScatterRoundProgressIndicatorBase,
    getStyles,
  );
