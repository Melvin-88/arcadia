import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../../styles/constants';

export interface IGroupInfoDialogStyleProps {
}

export interface IGroupInfoDialogStyles {
  content: IStyle;
  mainInfo: IStyle;
  chipsValueTitle: IStyle;
  regularChips: IStyle;
  chipRegular: IStyle;
  chipRegularIcon: IStyle;
  separator: IStyle;
}

export const getStyles = (): IGroupInfoDialogStyles => ({
  content: {
    color: Color.white,
    textShadow: '0 2px 1px #0a0a36',
  },
  mainInfo: {
    textAlign: 'left',
    margin: '4rem 0',
    lineHeight: '6rem',
  },
  chipsValueTitle: {
    textTransform: 'uppercase',
  },
  regularChips: {
    marginTop: '3rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '5rem 2rem',
  },
  chipRegular: {
    display: 'flex',
    alignItems: 'center',
  },
  chipRegularIcon: {
    width: '8.95rem',
    marginRight: '1.35rem',
  },
  separator: {
    marginRight: '1.07rem',
    color: Color.white,
  },
});

export const getClassNames = classNamesFunction<IGroupInfoDialogStyleProps, IGroupInfoDialogStyles>();
