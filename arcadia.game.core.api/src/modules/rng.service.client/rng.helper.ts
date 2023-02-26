import { Injectable } from '@nestjs/common';
import {
  Configuration,
  connectionNames,
  GroupEntity,
  InjectRepository,
  MachineEntity,
  RoundArchiveRepository,
  RoundRepository,
  RtpData,
  SeedHistoryRepository,
} from 'arcadia-dal';
import { from, of } from 'rxjs';
import {
  groupBy, map, mergeMap, reduce, repeat, toArray,
} from 'rxjs/operators';
import { AppLogger } from '../logger/logger.service';
import { RngClientService } from './rng.client.service';

@Injectable()
export class RngHelper {
  constructor(
    private readonly logger: AppLogger,
    @InjectRepository(RoundRepository, connectionNames.DATA)
    private readonly roundRepo: RoundRepository,
    @InjectRepository(RoundArchiveRepository, connectionNames.DATA)
    private readonly roundArchiveRepo: RoundArchiveRepository,
    @InjectRepository(SeedHistoryRepository, connectionNames.DATA)
    private readonly seedHistoryRepo: SeedHistoryRepository,
    private readonly rngClient: RngClientService,
  ) {

  }

  public async calcRtp(group: GroupEntity, machine: MachineEntity, config: Configuration, roundsRange = 100): Promise<RtpData[]> {
    const [rounds, archiveRounds]: [any[], any[]] = await Promise.all([
      this.roundRepo.find({
        where: { machineId: machine.id },
        order: { createDate: 'DESC' },
        take: roundsRange,
      }),
      this.roundArchiveRepo.find({
        where: { machineId: machine.id },
        order: { startDate: 'DESC' },
        take: roundsRange,
      }),
    ]);
    const fromDate = [...rounds, ...archiveRounds].map(value => (value.startDate
      ? new Date(value.startDate)
      : new Date(value.createDate)))
      .sort((a, b) => b.valueOf() - a.valueOf())
      .slice(0, roundsRange)
      .reverse()[0];
    const history = fromDate ? await this.seedHistoryRepo.getSeedHistory(machine.id, fromDate) : [];
    const rtpSeedResp = await this.rngClient.rtp(group.prizeGroup, config.rtpSegment, history);
    this.logger.log(`RNG "rtp" result: ${JSON.stringify(rtpSeedResp)}, machineSerial: ${machine.serial}`);
    return from(Object.entries(rtpSeedResp)).pipe(
      mergeMap(([type, count]) => of(type).pipe(repeat(count))),
      map(type => ({
        afterCoin: Math.floor(Math.random() * (group.stackSize - 2)) + 1, // push everything before the end of round
        type,
      })),
      groupBy(value => value.afterCoin, value => value.type),
      mergeMap(g => g.pipe(
        reduce((acc: RtpData, type) => {
          acc.types.push(type);
          return acc;
        }, { afterCoin: g.key, types: [] }))),
      toArray()).toPromise();
  }
}
