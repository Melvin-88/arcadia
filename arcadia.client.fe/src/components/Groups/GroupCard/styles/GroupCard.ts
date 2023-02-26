import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily } from '../../../../styles/constants';
import { GroupColorId } from '../../../../types/group';
import { forceMinAspectRatio } from '../../../../styles/helpers';
import { groupCardColorsMap } from '../../../../constants/group';

export interface IGroupCardStyleProps {
  color: GroupColorId;
}

export interface IGroupCardStyles {
  root: IStyle;
  queue: IStyle;
  imgQueue: IStyle;
  queueSize: IStyle;
  infoButton: IStyle;
  machineImg: IStyle;
  ribbon: IStyle;
  jackpot: IStyle;
  jackpotBackground: IStyle;
  jackpotContent: IStyle;
  stack: IStyle;
  imgStack: IStyle;
  stackBetTitle: IStyle;
  stackBet: IStyle;
  queueInfoText: IStyle;
  playBtn: IStyle;
}

export const getStyles = ({ color }: IGroupCardStyleProps): IGroupCardStyles => ({
  root: {
    width: '40.8rem',
    color: Color.white,
    background: groupCardColorsMap[color],
  },
  queue: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'absolute',
    left: '1.2rem',
    top: '1.62rem',
    width: '7.2rem',
    padding: '.7rem 0',
    fontFamily: FontFamily.tertiary,
    backgroundColor: Color.queueBar.backgroundColor,
    border: `0.6rem solid ${Color.queueBar.borderColor}`,
    borderRadius: '2.4rem',
    boxShadow: 'rgba(220, 81, 255, 0.46) 0.4rem -0.03rem 4.1rem 0px inset, rgb(81, 133, 255) -0.7rem 0px 2.3rem 0px inset',
  },
  imgQueue: {
    display: 'block',
    width: '5rem',
  },
  queueSize: {
    width: '100%',
    height: '2.86rem',
  },
  infoButton: {
    position: 'absolute',
    display: 'block',
    width: '6.3rem',
    right: '1.2rem',
    top: '1.62rem',
  },
  machineImg: {
    display: 'block',
    width: '21.4rem',
    margin: '0 auto',
    marginBottom: '3.4rem',
  },
  ribbon: {
    marginTop: '-7.5rem',
    width: 'calc(100% + 3rem)',
    marginLeft: '-1.5rem',
  },
  jackpot: [
    forceMinAspectRatio(337, 112),
    {
      width: '24.36rem',
      margin: '-1.2rem auto 0',
      position: 'relative',
    },
  ],
  jackpotBackground: {
    display: 'block',
    width: '100%',
  },
  jackpotContent: {
    position: 'absolute',
    bottom: '25%',
    height: '40%',
    color: Color.jackpotIndicator.valueColor,
    '-webkit-text-stroke': `0.05em ${Color.jackpotIndicator.valueStrokeColor}`,
    'background-image': 'linear-gradient(to top, rgba(255, 240, 0, 0.5) 0%, rgba(255, 255, 255, 0.5) 49%, rgba(255, 240, 0, 0.5) 100%)',
    '-webkit-background-clip': 'text',
    'background-clip': 'text',
  },
  stack: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '0.9rem',
    fontSize: '3.6rem',
  },
  imgStack: {
    display: 'block',
    flexShrink: '0',
    width: '6.2rem',
  },
  stackBet: {
    fontSize: '5.7rem',
  },
  stackBetTitle: {
    fontSize: '3.6rem',
    margin: '1.2rem 1.2rem 0',
    textTransform: 'uppercase',
  },
  queueInfoText: {
    fontSize: '2.4rem',
    margin: '1.5rem',
  },
  playBtn: {
    width: '30rem',
    color: Color.white,
    textTransform: 'uppercase',
  },
});

export const getClassNames = classNamesFunction<IGroupCardStyleProps, IGroupCardStyles>();
