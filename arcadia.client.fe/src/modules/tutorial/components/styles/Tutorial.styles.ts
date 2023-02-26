import { classNamesFunction } from '@uifabric/utilities';
import { IStyle } from '@uifabric/styling';
import { Color, FontFamily, FontSize } from '../../../../styles/constants';
import { hexToRGBA } from '../../../../styles/helpers';

const OVERFLOW_SCROLL_SHADOW_HEIGHT = 8;
const CARD_BACKGROUND_COLOR = Color.card.secondaryBackgroundColor;

export interface ITutorialStyleProps {}

export interface ITutorialStyles {
  card: IStyle;
  slide: IStyle;
  wrapper: IStyle;
  contentImage: IStyle;
  content: IStyle;
}

export const getStyles = (): ITutorialStyles => ({
  card: {
    backgroundColor: CARD_BACKGROUND_COLOR,
  },
  slide: {
    height: '100%',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: '100%',
    maxHeight: '60vh',
  },
  contentImage: {
    width: '100%',
  },
  content: {
    fontFamily: FontFamily.secondary,
    color: Color.primaryTextColor,
    fontSize: FontSize.Size7,
    textAlign: 'left',
    overflowY: 'auto',
    paddingRight: '0.8em',
    position: 'relative',
    zIndex: 1,
    background: 'transparent no-repeat',
    backgroundImage: `radial-gradient(farthest-side at 50% 0, ${hexToRGBA(Color.black, 0.5)}, transparent),
                      radial-gradient(farthest-side at 50% 100%, ${hexToRGBA(Color.black, 0.5)}, transparent)`,
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
      p: {
        margin: '2rem 0',
      },
    },
  },
});

export const getClassNames = classNamesFunction<ITutorialStyleProps, ITutorialStyles>();
