import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { hexToRGBA } from '../../../../../styles/helpers';
import { Color, FontFamily, FontSize } from '../../../../../styles/constants';

export interface IResultDialogStyleProps {}

export interface IResultDialogStyles {
  card: IStyle;
  container: IStyle;
  content: IStyle;
  title: IStyle;
  amount: IStyle;
}

export const getStyles = (): IResultDialogStyles => ({
  card: {
    backgroundColor: hexToRGBA(Color.card.defaultBackgroundColor, 0.7),
  },
  container: {
    paddingTop: '12.68rem',
  },
  content: {
    fontFamily: FontFamily.secondary,
    color: Color.primaryTextColor,
    textTransform: 'uppercase',
    padding: '2rem 0 4rem',
  },
  title: {
    fontSize: FontSize.Size3,
    fontWeight: 900,
    marginBottom: '5rem',
    '-webkit-text-stroke': '0.08em #21007c',
  },
  amount: {
    fontSize: FontSize.Size1,
    width: '100%',
    height: '20rem',
    lineHeight: '1',
    letterSpacing: '-0.55rem',
    color: '#ffcf00',
    backgroundImage: 'linear-gradient(to top, #fff000 0%, #ffb033 25%, #ffb828 42%, #ffdf90 42%, #ffe08a 50%, #fff000 100%)',
    backgroundClip: 'text',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    '-webkit-text-stroke': '0.04em #550050',
  },
});

export const getClassNames = classNamesFunction<
  IResultDialogStyleProps,
  IResultDialogStyles
>();
