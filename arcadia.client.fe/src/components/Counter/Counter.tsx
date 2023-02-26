import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { SoundsController } from '../../services/sounds/controller';
import { ButtonSound } from '../../services/sounds/types';
import {
  getClassNames, getStyles, ICounterStyleProps, ICounterStyles,
} from './styles/Counter';

export interface ICounterProps extends Partial<ICounterStyleProps> {
  styles?: IStyleFunctionOrObject<ICounterStyleProps, ICounterStyles>;
  value: number;
  minValue?: number;
  maxValue?: number;
  renderValue?: (value: number) => React.ReactNode;
  onChange: (value: number) => void;
  e2eSelector?: string;
  e2eSelectorValue?: string;
  e2eSelectorButtonDecrement?: string;
  e2eSelectorButtonIncrement?: string;
}

const CounterBase: React.FC<ICounterProps> = ({
  styles,
  classNameValue,
  value,
  minValue,
  maxValue,
  renderValue,
  onChange,
  e2eSelector = 'counter',
  e2eSelectorValue = 'counter-value',
  e2eSelectorButtonDecrement = 'counter-decrement-button',
  e2eSelectorButtonIncrement = 'counter-increment-button',
}) => {
  const soundsController = SoundsController.getInstance();
  const classNames = getClassNames(styles, { classNameValue });

  const handleDecrease = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.secondary);

    let nextValue = value - 1;

    if (minValue !== undefined) {
      nextValue = Math.max(minValue, nextValue);
    }

    onChange(nextValue);
  }, [value, minValue, soundsController]);

  const handleIncrease = useCallback(() => {
    soundsController.playButtonSound(ButtonSound.secondary);

    let nextValue = value + 1;

    if (maxValue !== undefined) {
      nextValue = Math.min(maxValue, nextValue);
    }

    onChange(nextValue);
  }, [value, maxValue, soundsController]);

  return (
    <div className={classNames.root} data-e2e-selector={e2eSelector}>
      <div
        className={classNames.decrement}
        role="button"
        tabIndex={0}
        aria-label="decrement"
        data-e2e-selector={e2eSelectorButtonDecrement}
        onClick={handleDecrease}
      />
      <div className={classNames.value} data-e2e-selector={e2eSelectorValue}>
        {
          renderValue
            ? renderValue(value)
            : value
        }
      </div>
      <div
        className={classNames.increment}
        role="button"
        tabIndex={0}
        aria-label="increment"
        data-e2e-selector={e2eSelectorButtonIncrement}
        onClick={handleIncrease}
      />
    </div>
  );
};

export const Counter = React.memo(
  styled<ICounterProps,
    ICounterStyleProps,
    ICounterStyles
  >(
    CounterBase,
    getStyles,
  ),
);
