import { IRawStyle, IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily, FontSize } from '../../../styles/constants';

export interface ICounterStyleProps {
  classNameValue?: string;
}

export interface ICounterStyles {
  root: IStyle;
  decrement: IStyle;
  value: IStyle;
  increment: IStyle;
}

const btnBarStyles: IRawStyle = {
  position: 'absolute',
  content: '""',
  width: '5.4rem',
  height: '0.71rem',
  backgroundColor: Color.white,
  borderRadius: '0.36rem',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const generalBtnStyles: IStyle = {
  position: 'relative',
  width: '11.14rem',
  height: '11.14rem',
  backgroundImage: `
    linear-gradient(135deg, ${Color.counter.btnBackgroundGradientStartColor} 0%, ${Color.counter.btnBackgroundGradientEndColor} 100%)
  `,
  border: `0.36rem solid ${Color.counter.btnBorderColor}`,
  borderRadius: '50%',
  selectors: {
    ':before, :after': {
      ...btnBarStyles,
    },
  },
};

export const getStyles = ({ classNameValue }: ICounterStyleProps): ICounterStyles => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '51.3rem',
    padding: '2.1rem',
    backgroundColor: Color.counter.backgroundColor,
    border: `0.6rem solid ${Color.counter.borderColor}`,
    borderRadius: '7.5rem',
  },
  decrement: generalBtnStyles,
  value: [
    {
      color: Color.white,
      fontFamily: FontFamily.tertiary,
      fontSize: FontSize.Size2,
      margin: '0 1.79rem',
      fontWeight: 700,
      letterSpacing: '-0.19rem',
    },
    classNameValue,
  ],
  increment: [
    generalBtnStyles,
    {
      selectors: {
        ':after': {
          transform: 'translate(-50%, -50%) rotate(-90deg)',
        },
      },
    },
  ],
});

export const getClassNames = classNamesFunction<ICounterStyleProps, ICounterStyles>();
