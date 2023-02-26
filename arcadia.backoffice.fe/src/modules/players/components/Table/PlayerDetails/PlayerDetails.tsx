import React from 'react';
import {
  Button, ButtonColor, ButtonVariant, Link, valueOrEmptyStub,
} from 'arcadia-common-fe';
import { IPlayer, PlayerCID, PlayerStatus } from '../../../types';
import { ROUTES_MAP } from '../../../../../routing/constants';
import { modulesInitialFilters } from '../../../../../constants';
import './PlayerDetails.scss';

interface IPlayerDetailsProps extends IPlayer {
  onBlock: (cid: PlayerCID) => void
  onUnblock: (cid: PlayerCID) => void
  onOpenSettingsJSON: (cid: PlayerCID) => void
  onOpenHistory: (cid: PlayerCID) => void
}

export const PlayerDetails: React.FC<IPlayerDetailsProps> = React.memo(({
  cid,
  status,
  onBlock,
  onUnblock,
  blockReason,
  connectedMachines,
  onOpenSettingsJSON,
  onOpenHistory,
}) => (
  <div className="player-details">
    <div className="player-details__values">
      <div className="player-details__info-bar">
        <div className="player-details__term">Settings</div>
        <Link
          className="player-details__value"
          preventDefault
          onClick={() => onOpenSettingsJSON(cid)}
        >
          JSON
        </Link>
      </div>
      <div className="player-details__info-bar">
        <div className="player-details__term">Blocking reason</div>
        <b className="player-details__value">
          { valueOrEmptyStub(blockReason) }
        </b>
      </div>
    </div>

    <div className="player-details__controls">
      <div className="player-details__controls-group">
        <Button
          className="player-details__btn"
          color={ButtonColor.quinary}
          disabled={status === PlayerStatus.blocked}
          onClick={() => onBlock(cid)}
        >
          Block
        </Button>
        <Button
          className="player-details__btn"
          color={ButtonColor.quinary}
          disabled={status !== PlayerStatus.blocked}
          onClick={() => onUnblock(cid)}
        >
          Unblock
        </Button>
        <div className="player-details__btn-splitter" />
        <Button
          className="player-details__btn"
          color={ButtonColor.tertiary}
          to={
            ROUTES_MAP.sessions.createURL({
              playerCid: cid,
              status: modulesInitialFilters.sessions.status,
            })
          }
        >
          Sessions
        </Button>
        <Button
          className="player-details__btn"
          color={ButtonColor.tertiary}
          disabled={!connectedMachines.length}
          to={ROUTES_MAP.machines.createURL({ name: connectedMachines })}
        >
          Machines
        </Button>
        <Button
          className="player-details__btn"
          color={ButtonColor.tertiary}
          disabled={!cid}
          to={ROUTES_MAP.players.createURL({ cid })}
        >
          Vouchers
        </Button>
      </div>
      <Button
        className="player-details__btn"
        variant={ButtonVariant.outline}
        onClick={() => onOpenHistory(cid)}
      >
        History
      </Button>
    </div>
  </div>
));
