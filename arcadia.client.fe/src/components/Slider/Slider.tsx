import React, { useCallback } from 'react';
import ReactSlider from 'react-slider';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import {
  getClassNames, getStyles, ISliderStyleProps, ISliderStyles,
} from './styles/Slider';

export interface ISliderProps extends ReactSlider.ReactSliderProps, Partial<ISliderStyleProps> {
  styles?: IStyleFunctionOrObject<ISliderStyleProps, ISliderStyles>;
}

const SliderBase: React.FC<ISliderProps> = (({ styles, className, ...restProps }) => {
  const renderThumb = useCallback((props) => (
    <div {...props} />
  ), []);

  const classNames = getClassNames(styles, { className });

  return (
    <ReactSlider
      className={classNames.root}
      trackClassName={classNames.track}
      thumbClassName={classNames.thumb}
      renderThumb={renderThumb}
      {...restProps}
    />
  );
});

export const Slider = React.memo(
  styled<ISliderProps,
    ISliderStyleProps,
    ISliderStyles
  >(
    SliderBase,
    getStyles,
  ),
);
