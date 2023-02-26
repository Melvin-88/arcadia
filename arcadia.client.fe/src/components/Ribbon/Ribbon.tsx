import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { TextFit } from '../TextFit/TextFit';
import { GroupColorId } from '../../types/group';
import imgRibbonDarkBlue from '../../assets/images/ribbons/darkBlueRibbon.png';
import imgRibbonLightGreen from '../../assets/images/ribbons/lightGreenRibbon.png';
import imgRibbonMentolGreen from '../../assets/images/ribbons/mentolGreenRibbon.png';
import imgRibbonOrange from '../../assets/images/ribbons/orangeRibbon.png';
import imgRibbonRed from '../../assets/images/ribbons/redRibbon.png';
import imgRibbonPurple from '../../assets/images/ribbons/purpleRibbon.png';
import imgRibbonYellow from '../../assets/images/ribbons/yellowRibbon.png';
import {
  getClassNames, getStyles, IRibbonStyleProps, IRibbonStyles,
} from './styles/Ribbon';

const DEFAULT_RIBBON_BACKGROUND = imgRibbonPurple;

export interface IRibbonProps extends Partial<IRibbonStyleProps> {
  styles?: IStyleFunctionOrObject<IRibbonStyleProps, IRibbonStyles>;
  className?: string;
  color: GroupColorId;
  children?: string;
}

const ribbonBackground: { [key in GroupColorId]: string } = {
  [GroupColorId.darkBlue]: imgRibbonDarkBlue,
  [GroupColorId.lightGreen]: imgRibbonLightGreen,
  [GroupColorId.mentolGreen]: imgRibbonMentolGreen,
  [GroupColorId.orange]: imgRibbonOrange,
  [GroupColorId.red]: imgRibbonRed,
  [GroupColorId.purple]: imgRibbonPurple,
  [GroupColorId.yellow]: imgRibbonYellow,
};

export const RibbonBase: React.FC<IRibbonProps> = ({
  styles, className, color, children,
}) => {
  const imgSrc = ribbonBackground[color] || DEFAULT_RIBBON_BACKGROUND;

  const classNames = getClassNames(styles, { className });

  return (
    <div className={classNames.root}>
      <img src={imgSrc} className={classNames.ribbonBackground} alt="ribbon background" />
      <TextFit className={classNames.ribbonContent}>{children}</TextFit>
    </div>
  );
};

export const Ribbon = styled<IRibbonProps, IRibbonStyleProps, IRibbonStyles>(
  RibbonBase,
  getStyles,
);
