import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../styles/constants';

export interface IAppLayoutStyleProps {
  contentMaxWidth: number | null;
}

export interface IAppLayoutStyles {
  app: IStyle;
  appMainContainer: IStyle;
}

export const getStyles = ({ contentMaxWidth }: IAppLayoutStyleProps): IAppLayoutStyles => ({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: Color.card.secondaryBackgroundColor,
    backgroundImage: `radial-gradient(circle, ${Color.card.borderColor} 25%, transparent 28%),
                      radial-gradient(circle, ${Color.card.borderColor} 25%, transparent 28%)`,
    backgroundSize: '50px 50px',
    backgroundPosition: '0 0, 75px 75px',
  },
  appMainContainer: [{
    display: 'flex',
    height: '100%',
    zIndex: 0,
    position: 'relative',
  },
  !!contentMaxWidth && {
    maxWidth: `${contentMaxWidth}px`,
    width: '100%',
    margin: '0 auto',
    overflow: 'hidden',
  }],
});

export const getClassNames = classNamesFunction<IAppLayoutStyleProps, IAppLayoutStyles>();
