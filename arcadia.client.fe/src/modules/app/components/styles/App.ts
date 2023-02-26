import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontSize } from '../../../../styles/constants';
import { customScrollbar } from '../../../../styles/mixins';

export interface IAppStyleProps {
}

export interface IAppStyles {
  appContent: IStyle;
  toastBody: IStyle;
}

export const getStyles = (): IAppStyles => ({
  appContent: [
    customScrollbar('0.6rem', Color.scrollBar.thumb, Color.scrollBar.track),
    {
      flex: '1',
      overflow: 'hidden',
      height: '100%',
    },
  ],
  toastBody: {
    fontSize: FontSize.Size8,
  },
});

export const getClassNames = classNamesFunction<IAppStyleProps, IAppStyles>();
