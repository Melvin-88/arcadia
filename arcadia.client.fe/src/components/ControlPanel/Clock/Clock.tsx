import React, { useState, useEffect } from 'react';
import { styled, IStyleFunctionOrObject } from '@uifabric/utilities';
import moment from 'moment';
import IconClock from '../../../assets/svg/clock.svg';
import {
  getClassNames, getStyles, IClockStyleProps, IClockStyles,
} from './styles/Clock';

export interface IClockProps extends Partial<IClockStyleProps> {
  styles?: IStyleFunctionOrObject<IClockStyleProps, IClockStyles>;
}

const ClockBase: React.FC<IClockProps> = (({ styles, className }) => {
  const classNames = getClassNames(styles, { className });

  const [date, setDate] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classNames.root}>
      <IconClock className={classNames.icon} />
      { moment(date).format('LT') }
    </div>
  );
});

export const Clock = React.memo(
  styled<
    IClockProps,
    IClockStyleProps,
    IClockStyles
  >(
    ClockBase,
    getStyles,
  ),
);
