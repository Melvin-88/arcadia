import { RouteProps } from 'react-router-dom';

export interface IRoutesMapItem extends RouteProps {
  path: string;
}

export type IRoutesMap = {
  [key: string]: IRoutesMapItem;
  game: IRoutesMapItem;
  auth: IRoutesMapItem;
  lobby: IRoutesMapItem;
  exit: IRoutesMapItem;
};

export interface IRoutes extends Array<IRoutesMapItem> {
}
