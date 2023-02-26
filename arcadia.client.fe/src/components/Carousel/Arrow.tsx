import React, { MouseEvent, useCallback } from 'react';
import { CustomArrowProps } from 'react-slick';
import { Button } from '../Button/Button';
import { SoundsController } from '../../services/sounds/controller';
import { ButtonSound } from '../../services/sounds/types';
import arrowLeftImage from '../../assets/images/carousel/arrowLeft.png';
import arrowRightImage from '../../assets/images/carousel/arrowRight.png';

export enum ArrowDirection {
  Left,
  Right,
}

export interface IArrowProps extends CustomArrowProps {
  direction: ArrowDirection;
  isCarouselInfinite: boolean;
}

function getArrowIcon(dir: ArrowDirection): string {
  switch (dir) {
    case ArrowDirection.Left:
      return arrowLeftImage;
    case ArrowDirection.Right:
      return arrowRightImage;
    default:
      return '';
  }
}

export const Arrow = ({
  direction,
  isCarouselInfinite,
  currentSlide,
  slideCount,
  onClick,
  ...restProps
}: IArrowProps) => {
  const slideBound = direction === ArrowDirection.Left ? 0 : (slideCount || 0) - 1;
  const isArrowDisabled = !isCarouselInfinite && currentSlide === slideBound;

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    SoundsController.getInstance().playButtonSound(ButtonSound.secondary);

    if (onClick) {
      onClick(event);
    }
  }, [onClick]);

  return (
    <Button
      isDisabled={isArrowDisabled}
      normalImg={getArrowIcon(direction)}
      onClick={handleClick}
      {...restProps}
    />
  );
};
