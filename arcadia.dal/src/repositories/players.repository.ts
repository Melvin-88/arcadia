import {
  EntityRepository, Repository, SelectQueryBuilder, UpdateResult,
} from 'typeorm';
import { PlayerEntity } from '../entities';
import { PlayerInterface, Sort } from '../interfaces';
import { setSorting } from '../utils';

@EntityRepository(PlayerEntity)
export class PlayerRepository extends Repository<PlayerEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<PlayerEntity>): void {
    queryBuilder.where('');
    if (filters.cid) {
      queryBuilder.andWhere('player.cid = :cid', { cid: filters.cid });
    }
    if (filters.status) {
      queryBuilder.andWhere('player.status IN (:status)', { status: filters.status });
    }
    if (filters.operatorName) {
      queryBuilder.andWhere('operator.name IN (:operatorName)', { operatorName: filters.operatorName });
    }
    if (filters.betsFrom) {
      queryBuilder.andWhere('player.bets >= :betsFrom', { betsFrom: filters.betsFrom });
    }
    if (filters.betsTo) {
      queryBuilder.andWhere('player.bets <= :betsTo', { betsTo: filters.betsTo });
    }
    if (filters.winsFrom) {
      queryBuilder.andWhere('player.wins >= :winsFrom', { winsFrom: filters.winsFrom });
    }
    if (filters.winsTo) {
      queryBuilder.andWhere('player.wins <= :winsTo', { winsTo: filters.winsTo });
    }
    if (filters.createdDateFrom) {
      queryBuilder.andWhere('player.create_date >= :createdDateFrom', { createdDateFrom: filters.createdDateFrom });
    }
    if (filters.createdDateTo) {
      queryBuilder.andWhere('player.create_date <= :createdDateTo', { createdDateTo: filters.createdDateTo });
    }
    if (filters.lastSessionDateFrom) {
      queryBuilder.andWhere('player.last_session_date >= :lastSessionDateFrom', { lastSessionDateFrom: filters.lastSessionDateFrom });
    }
    if (filters.lastSessionDateTo) {
      queryBuilder.andWhere('player.last_session_date <= :lastSessionDateTo', { lastSessionDateTo: filters.lastSessionDateTo });
    }
    queryBuilder.andWhere('player.is_deleted = false');
  }

  private buildQuery(): SelectQueryBuilder<PlayerEntity> {
    return this.createQueryBuilder('player')
      .select('player.cid', 'cid')
      .leftJoin('player.operator', 'operator')
      .addSelect('player.status', 'status')
      .addSelect('operator.name', 'operatorName')
      .addSelect('player.bets', 'bets')
      .addSelect('player.wins', 'wins')
      .addSelect('player.create_date', 'createdDate')
      .addSelect('player.last_session_date', 'lastSessionDate')
      .addSelect('player.settings', 'settings')
      .addSelect('player.block_reason', 'blockReason');
  }

  public async getAllPlayers(filters: any): Promise<[PlayerInterface[], number]> {
    let sortParam: Sort = { sort: 'player.create_date', order: 'DESC' };
    if (filters.sortBy) {
      if (filters.sortBy === 'status') {
        filters.sortBy = 'CASE player.status WHEN \'in-play\' THEN 1 WHEN \'active\' THEN 2 WHEN \'blocked\' THEN 3 END';
      }
      sortParam = setSorting(this, ['operatorName', 'createdDate',
        'CASE player.status WHEN \'in-play\' THEN 1 WHEN \'active\' THEN 2 WHEN \'blocked\' THEN 3 END'], filters.sortBy, filters.sortOrder);
    }
    const playersQuery = this.buildQuery();

    this.buildWhereString(filters, playersQuery);
    const players = await playersQuery
      .addOrderBy(sortParam.sort, sortParam.order)
      .limit(filters.take || 20)
      .offset(filters.offset || 0)
      .getRawMany();

    players.forEach(p => {
      p.netCash = parseFloat(p.netCash);
      p.settings = JSON.parse(p.settings);
    });

    const countQuery = this.createQueryBuilder('player')
      .select('player.cid', 'cid')
      .leftJoin('player.operator', 'operator')
      .select('COUNT(*)', 'count');
    this.buildWhereString(filters, countQuery);
    const count = await countQuery.getRawOne();

    return [players, parseInt(count.count, 10)];
  }

  public async getPlayerById(cid: string): Promise<PlayerInterface> {
    const playerQuery = this.buildQuery();
    playerQuery.where('player.cid = :cid', { cid });
    const player = await playerQuery.getRawOne();
    player.netCash = parseFloat(player.netCash);
    player.settings = JSON.parse(player.settings);

    return player;
  }

  public async getAllBlockingReasons(): Promise<string[]> {
    const reasons = await this.createQueryBuilder('player')
      .select('player.block_reason')
      .where('player.block_reason is not null')
      .orderBy('block_reason', 'ASC')
      .distinct(true)
      .getRawMany();
    if (reasons.length === 0 || reasons[0].block_reason === null) {
      return [];
    }
    return reasons.map(r => r.block_reason);
  }

  public countWin(cid: string, winAmount: number): Promise<UpdateResult> {
    return this.increment({ cid }, 'wins', winAmount);
  }

  public countBet(cid: string, betAmount: number): Promise<UpdateResult> {
    return this.increment({ cid }, 'bets', betAmount);
  }

  public cancelBet(cid: string, betAmount: number): Promise<UpdateResult> {
    return this.decrement({ cid }, 'bets', betAmount);
  }

  public getPlayersWithActiveSessions(): Promise<PlayerEntity[]> {
    return this.createQueryBuilder('p')
      .where('cid IN (SELECT DISTINCT player_cid FROM session)')
      .getMany();
  }
}
