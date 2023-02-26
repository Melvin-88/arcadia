import { PlayerAction, PlayerStatus } from './types';

export const playerStatusLabelMap: { [key in PlayerStatus]: string } = {
  [PlayerStatus.active]: 'Active',
  [PlayerStatus.inPlay]: 'In Play',
  [PlayerStatus.blocked]: 'Blocked',
};

export const playerActionLabelMap: { [key in PlayerAction]: string } = {
  [PlayerAction.block]: 'Block',
  [PlayerAction.unblock]: 'Unblock',
};
