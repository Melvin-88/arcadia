import { hexToRGBA } from './helpers';

export const Color = {
  white: '#ffffff',
  black: '#000000',
  primaryTextColor: '#ffffff',
  gameFooter: {
    backgroundColor: '#0b1d2b',
  },
  lobby: {
    background: '#393d74',
  },
  card: {
    borderColor: '#86a5fc',
    defaultBackgroundColor: '#5020b0',
    secondaryBackgroundColor: '#6e23d5',
  },
  groupColor: {
    darkBlue: '#3d5ddc',
    lightGreen: '#83c72f',
    mentolGreen: '#00b2a4',
    orange: '#e4811e',
    red: '#d02c4a',
    purple: '#7929f5',
    yellow: '#f0c22e',
  },
  groupRibbon: {
    contentColor: '#ffffff',
  },
  snackbar: {
    backgroundColor: '#251349',
    sectionBorderColor: '#a899cf',
  },
  buySnackbar: {
    currentBetTextColor: '#a899cf',
    autoplaySetupColor: '#bfffff',
    autoplaySetupStrokeColor: '#0036be',
    changeBetColor: '#d3ffff',
    changeBetStrokeColor: '#2b3b9d',
  },
  switch: {
    borderColor: '#a899cf',
    barBackgroundGradientStartColor: '#5fdaff',
    barBackgroundGradientEndColor: '#0087ff',
    onBarColor: '#a5df32',
    bodyBackgroundColor: '#0e002b',
  },
  overlay: {
    primaryBackgroundColor: '#0e1438',
    secondaryBackgroundColor: '#04001f',
  },
  loadingOverlay: {
    spinnerBackgroundColor: hexToRGBA('#1f4969', 0.65),
  },
  counter: {
    backgroundColor: '#0e002b',
    borderColor: '#a899cf',
    btnBackgroundGradientStartColor: '#5fdaff',
    btnBackgroundGradientEndColor: '#0087ff',
    btnBorderColor: '#6122ff',
    titleTextColor: '#a899cf',
  },
  sliderThumb: {
    thumbBackgroundGradientStartColor: '#5fdaff',
    thumbBackgroundGradientEndColor: '#0087ff',
  },
  buyConfirmButton: {
    coinsColor: '#ffe722',
    coinsStrokeColor: '#8d3d06',
    valueStrokeColor: '#46840e',
  },
  panel: {
    backgroundColor: '#251349',
    headerIconFillColor: '#4395de',
  },
  payTablePanel: {
    iconInfoColor: '#a899cf',
  },
  chipsBar: {
    borderColor: '#0a001d',
    backgroundColor: '#27004c',
    valueColor: '#ffbf24',
    valueStrokeColor: '#560301',
  },
  queueBar: {
    backgroundColor: '#27004c',
    borderColor: '#0a001d',
    valueStrokeColor: '#0a001d',
    separatorColor: '#8489f8',
  },
  controlPanel: {
    footerColor: '#bee4ff',
  },
  jackpotIndicator: {
    valueColor: '#ffbf24',
    valueStrokeColor: '#6b0640',
    valueDisabledColor: '#9f9784',
  },
  totalWinIndicator: {
    valueColor: '#ffbf24',
    valueStrokeColor: '#560301',
  },
  idleTimeoutProgressIndicator: {
    titleColor: '#82f8ff',
    textStrokeColor: '#21007c',
  },
  progressIndicator: {
    emptyCircleColor: '#ff0000',
  },
  progressBar: {
    mainColor: '#f0c22e',
  },
  roundProgressIndicator: {
    circleColor: '#eaff00',
    yourStacksStrokeColor: '#21007c',
  },
  betBehindRoundProgressIndicator: {
    roundColor: '#51ecff',
    strokeColor: '#21007c',
  },
  scatterRoundProgressIndicator: {
    roundColor: '#eaff00',
  },
  notFound: {
    backgroundColor: '#474749',
    textColor: '#b0b2ac',
    iconColor: '#d8d8d8',
    linkColor: '#3d9bcc',
  },
  chipWin: {
    backgroundColor: '#cfdeff',
    color: '#2a275a',
    borderColor: '#2a275a',
    loaderColor: '#2a275a',
  },
  scrollBar: {
    thumb: '#b0b2ac',
    track: '#474749',
  },
  slotMachine: {
    winBorderColor: '#eac840',
    winShadowColor: '#b67721',
    winColor: '#ffbf24',
    winStrokeColor: '#560301',
  },
};

export enum FontSize {
  Size1 = '8.5rem',
  Size2 = '7.5rem',
  Size3 = '6.4rem',
  Size4 = '5.7rem',
  Size5 = '5.41rem',
  Size6 = '5rem',
  Size7 = '4.2rem',
  Size8 = '3.7rem',
  Size9 = '3.2rem',
  Size10 = '3rem',
  Size11 = '2.8rem',
  Size12 = '2.1rem',
}

export const Time = {
  defaultAnimationTime: 0.3,
  spinnerAnimationTime: 2,
};

export enum FontFamily {
  primary = 'Helvetica',
  secondary = 'DinCyr-Black',
  tertiary = 'Impact',
}
