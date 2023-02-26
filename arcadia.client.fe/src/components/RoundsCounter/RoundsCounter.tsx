import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { Counter, ICounterProps } from '../Counter/Counter';
import {
  getClassNames, getStyles, IRoundsCounterStyleProps, IRoundsCounterStyles,
} from './styles/RoundsCounter';

export interface IRoundsCounterProps extends Omit<ICounterProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IRoundsCounterStyleProps, IRoundsCounterStyles>;
}

const CounterBase: React.FC<IRoundsCounterProps> = ({
  styles, ...restProps
}) => {
  const { t } = useTranslation();

  const classNames = getClassNames(styles);

  const renderValue = useCallback((currentValue) => (
    <>
      <div className={classNames.title}>
        {t('RoundsCounter.BetRounds')}
      </div>
      <div className={classNames.value}>
        { currentValue }
      </div>
    </>
  ), []);

  return (
    <Counter
      classNameValue={classNames.counterValue}
      renderValue={renderValue}
      e2eSelector="rounds-counter"
      e2eSelectorValue="rounds-counter-value"
      e2eSelectorButtonDecrement="rounds-decrement-button"
      e2eSelectorButtonIncrement="rounds-increment-button"
      {...restProps}
    />
  );
};

export const RoundsCounter = React.memo(
  styled<
    IRoundsCounterProps,
    IRoundsCounterStyleProps,
    IRoundsCounterStyles
  >(
    CounterBase,
    getStyles,
  ),
);
