import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily, Time } from '../../../../../styles/constants';

export interface IQueueBarStyleProps {
  className?: string;
}

export interface IQueueBarStyles {
  root: IStyle;
  collapsibleArrow: IStyle;
  container: IStyle;
  queueInfo: IStyle;
  queueInfoItem: IStyle;
  userIcon: IStyle;
  currentPlayingUserIcon: IStyle;
  separator: IStyle;
  generalInfo: IStyle;
  generalInfoItem: IStyle;
  generalInfoIcon: IStyle;
  generalInfoAmount: IStyle;
  queueInfoCurrentUserContainer: IStyle;
  currentUserContainer: IStyle;
  currentUserPosition: IStyle;
}

const currentUserContainerWidth = '20rem';

export const getStyles = ({ className }: IQueueBarStyleProps): IQueueBarStyles => ({
  root: [
    {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: '1',
      height: '100%',
      minWidth: '22rem',
      overflow: 'auto',
    },
    className,
  ],
  collapsibleArrow: {
    marginLeft: '-3.5rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '12.33rem',
    padding: '1.8rem 0 2rem 0',
    backgroundColor: Color.queueBar.backgroundColor,
    border: `0.8rem solid ${Color.queueBar.borderColor}`,
    borderRadius: '4rem',
    textAlign: 'center',
    fontFamily: FontFamily.tertiary,
    boxShadow: 'inset 1.7rem -0.03rem 5.4rem 0 rgba(220, 81, 255, 0.46), inset -1.7rem 0px 5.4rem 0 #5185ff',
  },
  queueInfo: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  queueInfoItem: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    transition: `margin ${Time.defaultAnimationTime}s`,
  },
  userIcon: {
    width: '67.43%',
  },
  currentPlayingUserIcon: {
    position: 'absolute',
    right: '-2.3rem',
    width: '3.31rem',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  separator: {
    width: '90%',
    padding: '1.8rem 0', // Paddings instead of margins and trick with ":before" are used to have easier queue items overlap computations
    selectors: {
      ':before': {
        display: 'block',
        content: '""',
        borderRadius: '1rem',
        height: '0.5rem',
        backgroundColor: Color.queueBar.separatorColor,
      },
    },
  },
  generalInfo: {
    flexShrink: '0',
    width: '100%',
  },
  generalInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
    selectors: {
      ':last-child': {
        marginBottom: 0,
      },
    },
  },
  generalInfoIcon: {
    width: '74.33%',
    marginBottom: '1.4rem',
  },
  generalInfoAmount: {
    width: '85.18%',
    height: '4.55rem',
    color: Color.primaryTextColor,
    lineHeight: '1',
    backgroundImage: 'linear-gradient(to top, #dff8ff 0%, #dff8ff 47%, #ffffff 51%, #ffffff 100%)',
    paintOrder: 'stroke fill',
    '-webkit-text-stroke': `0.065em ${Color.queueBar.valueStrokeColor}`,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  },
  queueInfoCurrentUserContainer: {
    width: currentUserContainerWidth,
    padding: '2.81rem 0 1rem', // Paddings instead of margins are used to have easier queue items overlap computations
    marginLeft: '-2.3rem',
  },
  currentUserContainer: {
    width: currentUserContainerWidth,
    margin: '-1.4rem 0 1.1rem -2.3rem',
  },
  currentUserPosition: {
    width: '85.18%',
    height: '4.75rem',
    fontFamily: FontFamily.secondary,
    letterSpacing: '-0.25rem',
    color: Color.primaryTextColor,
    lineHeight: '1',
    margin: '-1.9rem 0 0 -2.2rem',
    backgroundImage: 'linear-gradient(to top, #dff8ff 0%, #dff8ff 47%, #ffffff 51%, #ffffff 100%)',
    paintOrder: 'stroke fill',
    '-webkit-text-stroke': `0.065em ${Color.queueBar.valueStrokeColor}`,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  },
});

export const getClassNames = classNamesFunction<IQueueBarStyleProps, IQueueBarStyles>();
