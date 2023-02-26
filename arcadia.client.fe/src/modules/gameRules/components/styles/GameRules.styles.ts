import { classNamesFunction } from '@uifabric/utilities';
import { IStyle } from '@uifabric/styling';
import { Color, FontFamily, FontSize } from '../../../../styles/constants';
import { hexToRGBA } from '../../../../styles/helpers';

const OVERFLOW_SCROLL_SHADOW_HEIGHT = 8;
const CARD_BACKGROUND_COLOR = Color.card.secondaryBackgroundColor;

export interface IGameRulesStyleProps {}

export interface IGameRulesStyles {
  card: IStyle;
  wrapper: IStyle;
  title: IStyle;
  image: IStyle;
  content: IStyle;
}

export const getStyles = (): IGameRulesStyles => ({
  card: {
    backgroundColor: CARD_BACKGROUND_COLOR,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '50vh',
  },
  title: {
    fontFamily: FontFamily.secondary,
    color: Color.primaryTextColor,
    fontSize: FontSize.Size4,
    lineHeight: 'initial',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '60rem',
    marginTop: '3.5rem',
    alignSelf: 'center',
  },
  content: {
    fontFamily: FontFamily.secondary,
    color: Color.primaryTextColor,
    fontSize: FontSize.Size7,
    textAlign: 'justify',
    overflowY: 'auto',
    paddingRight: '0.8em',
    position: 'relative',
    zIndex: 1,
    background: 'transparent no-repeat',
    backgroundImage: `radial-gradient(farthest-side at 50% 1%, ${hexToRGBA(Color.black, 0.5)}, transparent),
                      radial-gradient(farthest-side at 50% 99%, ${hexToRGBA(Color.black, 0.5)}, transparent)`,
    backgroundPosition: '0 0.2rem, 0 calc(100% - 0.2rem)',
    backgroundSize: '100% 6rem',
    selectors: {
      ':before, :after': {
        content: '""',
        position: 'relative',
        zIndex: -1,
        display: 'block',
        height: `${OVERFLOW_SCROLL_SHADOW_HEIGHT}rem`,
        margin: `0 0 -${OVERFLOW_SCROLL_SHADOW_HEIGHT}rem`,
        background: `linear-gradient(to bottom, ${CARD_BACKGROUND_COLOR}, ${CARD_BACKGROUND_COLOR} 30%, transparent)`,
      },
      ':after': {
        margin: `-${OVERFLOW_SCROLL_SHADOW_HEIGHT}rem 0 0`,
        background: `linear-gradient(to bottom, transparent, ${CARD_BACKGROUND_COLOR} 70%, ${CARD_BACKGROUND_COLOR})`,
      },
      '& ul': {
        listStyle: 'disc',
        margin: '0.6em 0',
        paddingLeft: '1.4em',
      },
      '& li': {
        marginBottom: '0.3em',
      },
      '& li:last-child': {
        marginBottom: 0,
      },
      '& p': {
        margin: '0.3em 0 0.6em',
      },
      '& span': {
        textShadow: '0 0.1em 0.1em #21007C, 0 -0.1em 0.1em #21007C, 0.1em 0 0.1em #21007C, -0.1em 0 0.1em #21007C',
        '-webkit-text-stroke': '0.03em #21007C',
      },
    },
  },
});

export const getClassNames = classNamesFunction<IGameRulesStyleProps, IGameRulesStyles>();
