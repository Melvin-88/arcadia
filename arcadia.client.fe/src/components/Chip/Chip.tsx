import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import imgChipYellow from '../../assets/images/chips/yellow.png';
import imgChipGreen from '../../assets/images/chips/green.png';
import imgChipViolet from '../../assets/images/chips/violet.png';
import imgChipRed from '../../assets/images/chips/red.png';
import imgChipPhantom from '../../assets/images/chips/phantom.png';
import { ChipIconId, IChip } from '../../types/chip';
import {
  getClassNames, getStyles, IChipStyleProps, IChipStyles,
} from './styles/Chip';

export interface IChipProps extends Partial<IChipStyleProps> {
  styles?: IStyleFunctionOrObject<IChipStyleProps, IChipStyles>;
  chip: IChip;
}

const chipIcon: { [key in ChipIconId]: string } = {
  [ChipIconId.yellow]: imgChipYellow,
  [ChipIconId.red]: imgChipRed,
  [ChipIconId.green]: imgChipGreen,
  [ChipIconId.violet]: imgChipViolet,
  [ChipIconId.phantom]: imgChipPhantom,
};

export const ChipBase: React.FC<IChipProps> = ({ styles, className, chip }) => {
  const { iconId } = chip;
  const imgSrc = chipIcon[iconId];

  const classNames = getClassNames(styles, {
    className,
  });

  if (!imgSrc) {
    return null;
  }

  return (
    <img
      className={classNames.chip}
      src={imgSrc}
      alt=""
    />
  );
};

export const Chip = React.memo(
  styled<
    IChipProps,
    IChipStyleProps,
    IChipStyles
  >(
    ChipBase,
    getStyles,
  ),
);
