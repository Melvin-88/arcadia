export interface IGameRulesReducer {
  isOpened: boolean;
}

export interface IGameRulesReducerSlice {
  gameRulesReducer: IGameRulesReducer;
}

export interface IGameRulesScreen {
  id: string;
  title: string;
  image?: string;
  content: string;
}
