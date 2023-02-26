import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontSize } from '../../../styles/constants';

export interface IControlPanelStyleProps {
  className?: string;
}

export interface IControlPanelStyles {
  root: IStyle;
  panelBackground: IStyle;
  autoSwingBtn: IStyle;
  mainActionBtn: IStyle;
  autoplayBtn: IStyle;
  volumeBtn: IStyle;
  betBehindBtn: IStyle;
  betBehindStatus: IStyle;
  changeBetBtn: IStyle;
  footer: IStyle;
  joystick: IStyle;
  clock: IStyle;
  totalWin: IStyle;
  sessionId: IStyle;
}

export const getStyles = ({ className }: IControlPanelStyleProps): IControlPanelStyles => ({
  root: [
    {
      position: 'relative',
      width: '100%',
    },
    className,
  ],
  panelBackground: {
    display: 'block',
    width: '100%',
  },
  autoSwingBtn: {
    position: 'absolute',
    left: '10.13%',
    top: '10.83%',
    width: '21.6%',
  },
  mainActionBtn: {
    position: 'absolute',
    left: '50%',
    top: '-20.97%',
    width: '32.71%',
    transform: 'translateX(-50%)',
  },
  autoplayBtn: {
    position: 'absolute',
    left: '68.17%',
    top: '10.83%',
    width: '21.6%',
  },
  volumeBtn: {
    position: 'absolute',
    left: '1.6%',
    top: '54.97%',
    width: '19.2%',
  },
  betBehindBtn: {
    position: 'absolute',
    left: '24.88%',
    top: '36%',
    width: '50.31%',
  },
  betBehindStatus: {
    position: 'absolute',
    top: '40%',
    left: '23.57%',
    width: '52.08%',
  },
  changeBetBtn: {
    position: 'absolute',
    left: '78.66%',
    top: '54.97%',
    width: '19.2%',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    padding: '0 2.42%',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '10.9%',
    color: Color.controlPanel.footerColor,
  },
  joystick: {
    position: 'absolute',
    left: '24.53%',
    top: '54.5%',
    width: '50.93%',
  },
  clock: {
    flex: '1 1 0',
  },
  totalWin: {
    flexShrink: 0,
    width: '41.45%',
    marginTop: '-3.33%',
  },
  sessionId: {
    flex: '1 1 0',
    textAlign: 'right',
    fontSize: FontSize.Size10,
  },
});

export const getClassNames = classNamesFunction<IControlPanelStyleProps, IControlPanelStyles>();
