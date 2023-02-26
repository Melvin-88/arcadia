export interface ITutorialReducer {
  isOpened: boolean;
}

export interface ITutorialReducerSlice {
  tutorialReducer: ITutorialReducer;
}

export interface ITutorialScreen {
  id: string;
  image: string;
  steps: string[];
}
