import { IRawStyle, IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontSize, Time } from '../../../styles/constants';

export interface ISwitchStyleProps {
  className?: string;
  value?: boolean;
}

export interface ISwitchStyles {
  root: IStyle;
  labelOff: IStyle;
  labelOn: IStyle;
}

const generalLabelStyles: IRawStyle = {
  position: 'absolute',
  top: '1.4rem',
  color: Color.white,
  fontSize: FontSize.Size8,
  fontWeight: '700',
  textTransform: 'uppercase',
  pointerEvents: 'none',
};

export const getStyles = ({ className, value }: ISwitchStyleProps): ISwitchStyles => ({
  root: [
    {
      position: 'relative',
      display: 'inline-block',
      width: '17.15rem',
      height: '7.79rem',
      borderRadius: '4.21rem',
      backgroundColor: Color.switch.bodyBackgroundColor,
      border: `0.5rem solid ${Color.switch.borderColor}`,
      cursor: 'pointer',
      selectors: {
        ':after': {
          position: 'absolute',
          content: '""',
          width: '5.5rem',
          height: '5.5rem',
          top: '0.6rem',
          left: '0.8rem',
          zIndex: 1,
          borderRadius: '50%',
          backgroundImage: `
            linear-gradient(135deg, ${Color.switch.barBackgroundGradientStartColor} 0%, ${Color.switch.barBackgroundGradientEndColor} 100%)
          `,
          transition: `transform ${Time.defaultAnimationTime}s linear`,
        },
      },
    },
    value && {
      selectors: {
        ':after': {
          background: Color.switch.onBarColor,
          transform: 'translateX(8.9rem)',
        },
      },
    },
    className,
  ],
  labelOff: [
    generalLabelStyles,
    {
      right: '1.79rem',
      opacity: 1,
    },
    value && {
      opacity: 0,
    },
  ],
  labelOn: [
    generalLabelStyles,
    {
      left: '2.79rem',
      opacity: 0,
    },
    value && {
      opacity: 1,
    },
  ],
});

export const getClassNames = classNamesFunction<ISwitchStyleProps, ISwitchStyles>();
