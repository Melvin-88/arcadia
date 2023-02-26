import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../styles/constants';
import { forceMinAspectRatio, hexToRGBA } from '../../../styles/helpers';

export interface IRibbonStyleProps {
  className?: string;
}

export interface IRibbonStyles {
  root: IStyle;
  ribbonBackground: IStyle;
  ribbonContent: IStyle;
}

export const getStyles = ({ className }: IRibbonStyleProps): IRibbonStyles => ({
  root: [
    forceMinAspectRatio(272, 54),
    {
      width: '100%',
      position: 'relative',
    },
    className,
  ],
  ribbonBackground: {
    display: 'block',
    width: '100%',
  },
  ribbonContent: {
    position: 'absolute',
    left: '24.55%',
    top: '15%',
    width: '52.24%',
    height: '46.6%',
    color: Color.groupRibbon.contentColor,
    textAlign: 'center',
    textShadow: `0px 0.075em 0px ${hexToRGBA(Color.black, 0.5)},
                 0px -0.075em 0px ${hexToRGBA(Color.black, 0.5)}`,
    textTransform: 'uppercase',
    '-webkit-text-stroke': `0.05em ${Color.black}`,
    'background-image': `linear-gradient(to top,
      rgba(255, 213, 69, 0.5) 0%,
      rgba(255, 213, 69, 0.5) 50%,
      rgba(255, 176, 51, 0.5) 72%,
      rgba(255, 240, 0, 0.5) 100%)`,
    '-webkit-background-clip': 'text',
    'background-clip': 'text',
  },
});

export const getClassNames = classNamesFunction<IRibbonStyleProps, IRibbonStyles>();
