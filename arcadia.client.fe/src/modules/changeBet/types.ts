import { IGroups } from '../../types/group';

export interface IChangeBetReducer {
  isSnackbarOpen: boolean;
  groups: IGroups;
}

export interface IChangeBetReducerSlice {
  changeBetReducer: IChangeBetReducer;
}
