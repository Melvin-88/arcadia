import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  connectionNames,
  getRepositoryToken,
  InjectRepository,
  PlayerRepository,
  PlayerStatus,
  SessionRepository,
} from 'arcadia-dal';
import { ContextId, ModuleRef } from '@nestjs/core';
import {
  BlockReasonsResponse,
  PlayerResponse,
  PlayersResponse,
} from './players.interface';
import { PLAYER_BLOCK_FORBIDDEN, PLAYER_NOT_FOUND, PLAYER_UNBLOCK_FORBIDDEN } from '../../messages/messages';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(SessionRepository, connectionNames.DATA) private readonly sessionRepository: SessionRepository,
    private readonly moduleRef: ModuleRef,
  ) {}

  public async getPlayers(filters: any, contextId: ContextId): Promise<PlayersResponse> {
    const playerRepository: PlayerRepository = await this.moduleRef
      .resolve<PlayerRepository>(getRepositoryToken(PlayerRepository, connectionNames.DATA), contextId);
    const playersRaw = await playerRepository.getAllPlayers(filters); // TODO: Add currency column to DB
    const players = playersRaw[0].map(p => ({
      ...p,
      currency: 'USD',
    }));
    for (const p of players) {
      (p as PlayerResponse).connectedMachines = await this.sessionRepository.getPlayersConnectedMachines(p.cid);
    }
    return {
      players: players as PlayerResponse[],
      total: playersRaw[1],
    };
  }

  public async getBlockReasons(contextId: ContextId): Promise<BlockReasonsResponse> {
    const playerRepository: PlayerRepository = await this.moduleRef
      .resolve<PlayerRepository>(getRepositoryToken(PlayerRepository, connectionNames.DATA), contextId);
    const blockReasons = await playerRepository.getAllBlockingReasons();

    return { blockReasons };
  }

  public async blockPlayer(cid: string, reason: string, contextId: ContextId): Promise<PlayerResponse> {
    const playerRepository: PlayerRepository = await this.moduleRef
      .resolve<PlayerRepository>(getRepositoryToken(PlayerRepository, connectionNames.DATA), contextId);
    const player = await playerRepository.findOne({ where: { cid, isDeleted: false }, relations: ['operator'] });
    if (!player) {
      throw new NotFoundException(PLAYER_NOT_FOUND.en);
    }
    if (player.status === PlayerStatus.BLOCKED) {
      throw new BadRequestException(PLAYER_BLOCK_FORBIDDEN.en);
    }
    player.status = PlayerStatus.BLOCKED;
    player.blockReason = reason;
    await playerRepository.save(player);
    const updatedPlayer = await playerRepository.getPlayerById(cid);
    const connectedMachines = await this.sessionRepository.getPlayersConnectedMachines(updatedPlayer.cid);
    return {
      ...updatedPlayer,
      currency: 'USD',
      connectedMachines,
    };
    // TODO: Terminate user session's if there are any
  }

  public async unblockPlayer(cid: string, contextId: ContextId): Promise<PlayerResponse> {
    const playerRepository: PlayerRepository = await this.moduleRef
      .resolve<PlayerRepository>(getRepositoryToken(PlayerRepository, connectionNames.DATA), contextId);
    const player = await playerRepository.findOne({ where: { cid, isDeleted: false }, relations: ['operator'] });
    if (!player) {
      throw new NotFoundException(PLAYER_NOT_FOUND.en);
    }
    if (player.status !== PlayerStatus.BLOCKED) {
      throw new BadRequestException(PLAYER_UNBLOCK_FORBIDDEN.en);
    }
    player.status = PlayerStatus.ACTIVE;
    player.blockReason = null;
    await playerRepository.save(player);
    const updatedPlayer = await playerRepository.getPlayerById(cid);
    const connectedMachines = await this.sessionRepository.getPlayersConnectedMachines(updatedPlayer.cid);
    return {
      ...updatedPlayer,
      currency: 'USD',
      connectedMachines,
    };
  }
}
