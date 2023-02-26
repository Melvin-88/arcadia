export interface IOverlayReducer {
  isMachineSeedingVisible: boolean;
  isRegularRoundStartVisible: boolean;
  isScatterRoundStartVisible: boolean;
  isScatterRoundWonVisible: boolean;
}

export interface IOverlayReducerSlice {
  overlayReducer: IOverlayReducer;
}
