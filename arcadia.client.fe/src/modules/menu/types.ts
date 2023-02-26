export enum MenuType {
  main,
  settings,
  tutorial,
  payTable
}

export interface IMenuReducer {
  openedMenu: MenuType | null;
}

export interface IMenuReducerSlice {
  menuReducer: IMenuReducer;
}
