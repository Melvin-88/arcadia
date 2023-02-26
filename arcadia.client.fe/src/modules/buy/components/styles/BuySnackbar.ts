import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontSize } from '../../../../styles/constants';
import { forceMinAspectRatio } from '../../../../styles/helpers';

export interface IBuySnackbarStyleProps {
  isVoucherAvailable: boolean;
}

export interface IBuySnackbarStyles {
  mainInfo: IStyle;
  stackSizeIcon: IStyle;
  currentBet: IStyle;
  roundsSettings: IStyle;
  voucher: IStyle;
  autoplaySetupBtn: IStyle;
  autoplaySetupBtnContent: IStyle;
  buySettings: IStyle;
  changeBetBtn: IStyle;
  changeBetBtnContent: IStyle;
  buyConfirmButton: IStyle;
  snackbar: IStyle;
}

export const getStyles = ({ isVoucherAvailable }: IBuySnackbarStyleProps): IBuySnackbarStyles => ({
  mainInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '-2rem',
    padding: '1.08rem 0 2.5rem',
    borderTop: `0.3rem solid ${Color.snackbar.sectionBorderColor}`,
    textAlign: 'left',
    fontSize: FontSize.Size9,
  },
  stackSizeIcon: {
    width: '6.2rem',
    marginRight: '0.3rem',
  },
  currentBet: {
    color: Color.buySnackbar.currentBetTextColor,
  },
  roundsSettings: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voucher: [
    {
      width: '21.28%',
      marginRight: '2.58rem',
    },
    !isVoucherAvailable && {
      pointerEvents: 'none',
      filter: 'grayscale(1) opacity(0.5)',
    },
  ],
  autoplaySetupBtn: [
    forceMinAspectRatio(72, 51),
    {
      width: '20.12%',
      marginLeft: '4.29rem',
    },
  ],
  autoplaySetupBtnContent: {
    padding: '2.7rem 2.6rem 3.9rem',
    whiteSpace: 'pre-line',
    color: Color.buySnackbar.autoplaySetupColor,
    '-webkit-text-stroke': `0.03em ${Color.buySnackbar.autoplaySetupStrokeColor}`,
  },
  buySettings: {
    display: 'flex',
    marginTop: '1rem',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  changeBetBtn: [
    forceMinAspectRatio(142, 82),
    {
      width: '20.4%',
    },
  ],
  changeBetBtnContent: {
    padding: '2.7rem 2.5rem 3.9rem',
    lineHeight: '1',
    whiteSpace: 'pre-line',
    color: Color.buySnackbar.changeBetColor,
    '-webkit-text-stroke': `0.03em ${Color.buySnackbar.changeBetStrokeColor}`,
  },
  snackbar: {
    padding: '0 4.2rem 3.21rem',
  },
  buyConfirmButton: {
    width: '55.1%',
    marginRight: '2.7rem',
  },
});

export const getClassNames = classNamesFunction<IBuySnackbarStyleProps, IBuySnackbarStyles>();
