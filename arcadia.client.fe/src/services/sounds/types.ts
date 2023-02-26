export enum SoundChannel {
  lobbyBackground = 'lobbyBackground',
  queueBackground = 'queueBackground',
  gameBackground = 'gameBackground',
  primaryButton = 'primaryButton',
  secondaryButton = 'secondaryButton',
  joystickTick = 'joystickTick',
  fortuneWheelStart = 'fortuneWheelStart',
  fortuneWheelTick = 'fortuneWheelTick',
  scatterRoundStart = 'scatterRoundStart',
  scatterRoundWin = 'scatterRoundWin',
  disappoint = 'disappoint',
  toggleButton = 'toggleButton',
  whooshSecondary = 'whooshSecondary',
  queueStateChange = 'queueStateChange',
  timeoutOver = 'timeoutOver',
  dialogOpen = 'dialogOpen',
  chipDetection = 'chipDetection',
  chipWinPrimary = 'chipWinPrimary',
  chipWinSecondary = 'chipWinSecondary',
  chipWinTertiary = 'chipWinTertiary',
  chipWinQuaternary = 'chipWinQuaternary',
  chipWinQuinary = 'chipWinQuinary',
  chipWinPhantom = 'chipWinPhantom',
  jackpotWin = 'jackpotWin',
  sessionResult = 'sessionResult',
}

export enum BackgroundSound {
  lobby,
  queue,
  game,
}

export enum ButtonSound {
  primary,
  secondary,
  toggle,
}

export enum SoundEffect {
  whooshSecondary,
  dialogOpenToggle,
  joystickTick,
  disappoint,
}

export enum GameEventSound {
  queue,
  timeout,
  chipDetection,
  jackpotWin,
  sessionResult,
  scatterRoundStart,
  scatterRoundWin,
  fortuneWheelStart,
  fortuneWheelTick,
}

export enum ChipWinSound {
  chipWinPrimary= 'chipWinPrimary',
  chipWinSecondary = 'chipWinSecondary',
  chipWinTertiary = 'chipWinTertiary',
  chipWinQuaternary = 'chipWinQuaternary',
  chipWinQuinary = 'chipWinQuinary',
  chipWinPhantom = 'chipWinPhantom',
}
