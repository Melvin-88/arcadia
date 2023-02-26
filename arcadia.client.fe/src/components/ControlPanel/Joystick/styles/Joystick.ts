import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { hexToRGBA } from '../../../../styles/helpers';
import { Color, Time } from '../../../../styles/constants';

export interface IJoystickStyleProps {
  className?: string;
  isAutoSwingEnabled?: boolean;
}

export interface IJoystickStyles {
  root: IStyle;
  joystickBase: IStyle;
  joystickBaseIcon: IStyle;
  joystickRail: IStyle;
  joystickRailIcon: IStyle;
  joystickBall: IStyle;
  joystickBallIcon: IStyle;
}

export const getStyles = ({ className, isAutoSwingEnabled }: IJoystickStyleProps): IJoystickStyles => ({
  root: [
    {
      display: 'flex',
      alignItems: 'flex-start',
      transition: `filter ${Time.defaultAnimationTime}s`,
    },
    isAutoSwingEnabled && {
      filter: 'grayscale(100%)',
      pointerEvents: 'none',
    },
    className,
  ],
  joystickBase: {
    position: 'relative',
    display: 'block',
    width: '100%',
  },
  joystickBaseIcon: {
    display: 'block',
    width: '100%',
  },
  joystickRail: {
    position: 'absolute',
    display: 'block',
    top: '45.7%',
    left: '12%',
    right: '12%',
    transform: 'translateY(-50%)',
  },
  joystickRailIcon: {
    display: 'block',
    width: '100%',
  },
  joystickBall: {
    position: 'absolute',
    top: '50%',
    display: 'block',
    width: '23.2%',
    boxShadow: `0 2.5rem 1.07rem ${hexToRGBA(Color.black, 0.28)}`,
    borderRadius: '50%',
  },
  joystickBallIcon: {
    display: 'block',
    width: '100%',
    '-webkit-user-drag': 'none',
    '-khtml-user-drag': 'none',
    '-moz-user-drag': 'none',
    '-o-user-drag': 'none',
    'user-drag': 'none',
  },
});

export const getClassNames = classNamesFunction<IJoystickStyleProps, IJoystickStyles>();
