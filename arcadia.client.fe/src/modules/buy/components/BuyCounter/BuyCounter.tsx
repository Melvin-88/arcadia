import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Counter, ICounterProps } from '../../../../components/Counter/Counter';
import imgStack from '../../../../assets/images/stacks.png';
import {
  getClassNames, getStyles, IBuyCounterStyleProps, IBuyCounterStyles,
} from './styles/BuyCounter';

export interface IBuyCounterProps extends Omit<ICounterProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IBuyCounterStyleProps, IBuyCounterStyles>;
}

const BuyCounterBase: React.FC<IBuyCounterProps> = ({
  styles, ...restProps
}) => {
  const classNames = getClassNames(styles);

  const renderValue = useCallback((currentValue) => (
    <div className={classNames.value}>
      { currentValue }
      <span className={classNames.factor}>x</span>
      <img
        className={classNames.iconValue}
        src={imgStack}
        alt=""
      />
    </div>
  ), []);

  return (
    <Counter
      renderValue={renderValue}
      e2eSelector="buy-rounds-counter"
      e2eSelectorValue="buy-rounds-counter-value"
      e2eSelectorButtonDecrement="buy-rounds-decrement-button"
      e2eSelectorButtonIncrement="buy-rounds-increment-button"
      {...restProps}
    />
  );
};

export const BuyCounter = React.memo(
  styled<
    IBuyCounterProps,
    IBuyCounterStyleProps,
    IBuyCounterStyles
  >(
    BuyCounterBase,
    getStyles,
  ),
);
