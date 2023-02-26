import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../../styles/constants';

export interface ISettingsPanelStyleProps {
}

export interface ISettingsPanelStyles {
  settings: IStyle;
  settingsTitle: IStyle;
  switchSection: IStyle;
  sliderTitle: IStyle;
  sliderSection: IStyle;
  volumeIcon: IStyle;
}

export const getStyles = (): ISettingsPanelStyles => ({
  settings: {
    marginTop: '7.45rem',
    padding: '0 1.097rem 0 1.79rem',
  },
  settingsTitle: {
    display: 'flex',
    textTransform: 'uppercase',
  },
  switchSection: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '6.76rem',
  },
  sliderTitle: {
    marginBottom: '4rem',
  },
  sliderSection: {
    marginTop: '6.76rem',
  },
  volumeIcon: {
    width: '6.07rem',
    marginRight: '1.95rem',
    fill: Color.white,
  },
});

export const getClassNames = classNamesFunction<ISettingsPanelStyleProps, ISettingsPanelStyles>();
