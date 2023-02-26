import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { FontSize } from '../../../../styles/constants';

export interface IAutoplaySetupSnackbarStyleProps {
}

export interface IAutoplaySetupSnackbarStyles {
  roundsCounterTitle: IStyle;
  sliderContainer: IStyle;
  sliderValue: IStyle;
  playButton: IStyle;
  snackbarHeader: IStyle;
  roundsCounterSection: IStyle;
  sliderSection: IStyle;
  slider: IStyle;
  switchSection: IStyle;
  playButtonSection: IStyle;
}

export const getStyles = (): IAutoplaySetupSnackbarStyles => ({
  roundsCounterTitle: {
    marginBottom: '1.21rem',
    fontSize: FontSize.Size8,
  },
  sliderContainer: {
    display: 'flex',
    marginTop: '3.01rem',
  },
  sliderValue: {
    display: 'flex',
    flexShrink: 0,
    width: '18%',
    height: '4.2rem',
    marginLeft: '4.31%',
    letterSpacing: '-0.14rem',
  },
  playButton: {
    width: '16.58%',
  },
  snackbarHeader: {
    padding: '4rem 0 2.7rem',
  },
  roundsCounterSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.9rem 0 3rem',
  },
  sliderSection: {
    padding: '1.65rem 1.5rem 2.32rem',
    fontSize: FontSize.Size8,
  },
  slider: {
    flexGrow: 1,
  },
  switchSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3.6rem 1.5rem 2.6rem',
  },
  playButtonSection: {
    padding: '2.07rem 0 1.5rem',
  },
});

export const getClassNames = classNamesFunction<IAutoplaySetupSnackbarStyleProps, IAutoplaySetupSnackbarStyles>();
