import React, { useState, Children, useMemo } from 'react';
import Slider, { Settings } from 'react-slick';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { Arrow, ArrowDirection } from './Arrow';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import './styles/Carousel.scss';
import {
  getStyles, getClassNames, ICarouselStyleProps, ICarouselStyles,
} from './styles/Carousel';

const INITIAL_SLIDE = 0;

export type ICarouselSettings = Settings;

interface ICarouselProps extends Partial<ICarouselSettings>, ICarouselStyleProps {
  styles?: IStyleFunctionOrObject<ICarouselStyleProps, ICarouselStyles>;
  progressBar?: boolean;
}

export const CarouselBase: React.FC<ICarouselProps> = ({
  styles,
  progressBar,
  infinite,
  children,
  ...restProps
}) => {
  const [progress, setProgress] = useState(INITIAL_SLIDE);

  const defaultSettings: ICarouselSettings = useMemo(() => ({
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: INITIAL_SLIDE,
    nextArrow: <Arrow direction={ArrowDirection.Right} isCarouselInfinite={infinite || false} />,
    prevArrow: <Arrow direction={ArrowDirection.Left} isCarouselInfinite={infinite || false} />,
    beforeChange: (currentSlide: number, nextSlide: number) => {
      setProgress(nextSlide);
    },
  }), [infinite]);

  const totalSlides = Children.count(children) - 1;

  const classNames = getClassNames(styles);

  return (
    <>
      <Slider {...defaultSettings} infinite={infinite} {...restProps}>
        {children}
      </Slider>
      {progressBar && (
        <div className={classNames.progressContainer}>
          <ProgressBar current={progress} total={totalSlides} />
        </div>
      )}
    </>
  );
};

export const Carousel = styled<ICarouselProps, ICarouselStyleProps, ICarouselStyles>(
  CarouselBase,
  getStyles,
);
