import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontSize } from '../../../styles/constants';

export interface IGameFooterStyleProps {
}

export interface IGameFooterStyles {
  root: IStyle;
}

export const getStyles = (): IGameFooterStyles => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    padding: '2.5rem 3.21rem 3.21rem',
    fontSize: FontSize.Size7,
    fontWeight: 700,
    letterSpacing: '-0.31',
    lineHeight: '1.5',
    color: Color.primaryTextColor,
    backgroundColor: Color.gameFooter.backgroundColor,
  },
});

export const getClassNames = classNamesFunction<IGameFooterStyleProps, IGameFooterStyles>();
