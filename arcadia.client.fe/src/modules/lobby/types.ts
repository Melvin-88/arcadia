import { IGroups } from '../../types/group';

export interface IGetLobbyDataRequestQueryParams {
  token: string;
}

export interface IGetLobbyDataResponseBody {
  groups: IGroups;
}

export interface ILobbyReducer {
  readonly groups: IGroups;
}

export interface ILobbyReducerStoreSlice {
  lobbyReducer: ILobbyReducer;
}
