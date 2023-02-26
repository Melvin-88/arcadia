import { combineReducers } from 'redux';
import { appReducer } from '../modules/app/reducer';
import { lobbyReducer } from '../modules/lobby/state/reducer';
import { gameReducer } from '../modules/game/state/reducer';
import { queueReducer } from '../modules/queue/reducer';
import { jackpotReducer } from '../modules/jackpot/state/reducer';
import { buyReducer } from '../modules/buy/state/reducer';
import { autoplayReducer } from '../modules/autoplay/state/reducer';
import { betBehindReducer } from '../modules/betBehind/state/reducer';
import { changeBetReducer } from '../modules/changeBet/state/reducer';
import { menuReducer } from '../modules/menu/state/reducer';
import { overlayReducer } from '../modules/overlay/state/reducer';
import { tutorialReducer } from '../modules/tutorial/state/reducer';
import { gameRulesReducer } from '../modules/gameRules/state/reducer';

export const combinedReducer = combineReducers({
  appReducer,
  lobbyReducer,
  gameReducer,
  queueReducer,
  jackpotReducer,
  buyReducer,
  autoplayReducer,
  betBehindReducer,
  changeBetReducer,
  menuReducer,
  overlayReducer,
  tutorialReducer,
  gameRulesReducer,
});
