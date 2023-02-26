import { HttpService, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AlertSeverity, AlertSource, AlertType, ChipEntity, SeedHistoryEntity,
} from 'arcadia-dal';
import { from, of, throwError } from 'rxjs';
import {
  catchError, mergeMap, reduce, retryWhen,
} from 'rxjs/operators';
import { genericRetryStrategy } from '../../util/generic.retry.strategy';
import { AppLogger } from '../logger/logger.service';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { RNG_RETRY_ATTEMPTS } from './constants';
import { PhantomPrizeDto } from './dto/phantom.prize.dto';
import { RngResponseDto } from './dto/rng.response.dto';

@Injectable()
export class RngClientService {
  constructor(private readonly rngClient: HttpService,
              private readonly logger: AppLogger,
              private readonly monitoringClientService: MonitoringWorkerClientService) {
  }

  public async seed(
    group: string, minimalValue: number, minimalCount: number, rtpSegment: string,
    chipsOnTable: ChipEntity[] = [],
  ): Promise<Record<string, number>> {
    const tableState = chipsOnTable.map(chip => ({
      type: chip.type.name,
      value: chip.value,
    }));
    return this.rngClient.get<RngResponseDto>('/seed',
      {
        params: {
          group,
          minimal_value: minimalValue,
          minimal_count: minimalCount,
          rtpSegment,
          chips_on_table: JSON.stringify(tableState),
        },
      }).pipe(
      mergeMap(({ data }) => {
        if (!data.status || data.status === 'err' || !data.seed) {
          this.logger.error(data.msg || 'RNG seed request failed');
          return throwError(new RpcException(data.msg || 'RNG seed request failed'));
        }
        return from(data.seed)
          .pipe(
            reduce((acc: Record<string, number>, seed) => {
              if (acc[seed.name]) {
                acc[seed.name] += 1;
              } else {
                acc[seed.name] = 1;
              }
              return acc;
            }, {}));
      }),
      retryWhen(genericRetryStrategy(RNG_RETRY_ATTEMPTS, 1000)),
    ).toPromise();
  }

  public async rtp(
    group: string, rtpSegment: string, seedHistory: SeedHistoryEntity[],
  ): Promise<Record<string, number>> {
    const seedSquash = seedHistory?.length
      ? [seedHistory.flatMap(value => Object.entries(value.seed))
        .reduce((acc: Record<string, number>, [type, count]) => {
          if (acc[type]) {
            acc[type] += count;
          } else {
            acc[type] = count;
          }
          return acc;
        }, {})]
      : [];
    return this.rngClient.get<RngResponseDto>('/rtp',
      {
        params: {
          group,
          rtpSegment,
          seed: JSON.stringify(seedSquash),
        },
      }).pipe(
      mergeMap(({ data }) => {
        if (!data.status || data.status === 'err' || !data.rtp) {
          this.logger.error(data.msg || 'RNG rtp call error');
          return throwError(new RpcException(data.msg || 'RNG rtp call error'));
        }
        return from(data.rtp)
          .pipe(
            reduce((acc: Record<string, number>, rtp) => {
              if (acc[rtp.name]) {
                acc[rtp.name] += 1;
              } else {
                acc[rtp.name] = 1;
              }
              return acc;
            }, {}));
      }),
      retryWhen(genericRetryStrategy(RNG_RETRY_ATTEMPTS, 1000)),
      catchError(err => {
        // it is acceptable to proceed gameplay without rtp seeding
        this.monitoringClientService.sendAlertMessage({
          alertType: AlertType.WARNING,
          severity: AlertSeverity.MEDIUM,
          source: AlertSource.GAME_CORE,
          description: 'Rtp error',
          additionalInformation: {
            group,
            rtpSegment,
            errorMessage: err.response.data,
          },
        });
        this.logger.error(`RNG rtp call error=${JSON.stringify(err)}, fall back to empty response`);
        return of<Record<string, number>>({});
      }),
    ).toPromise();
  }

  public async phantom(group: string, rtpSegment: string): Promise<PhantomPrizeDto> {
    return this.rngClient.get<RngResponseDto>('/phantom', {
      params: {
        group,
        rtpSegment,
      },
    }).pipe(
      mergeMap(({ data }) => {
        if (!data.status || data.status === 'err' || !data.prize) {
          this.logger.error(data.msg || 'RNG phantom call error');
          return throwError(new RpcException(data.msg || 'RNG phantom call error'));
        }
        this.logger.log(`RNG "phantom" result: ${JSON.stringify(data.prize)}, group: ${group}`);
        return of(data.prize);
      }),
      retryWhen(genericRetryStrategy(RNG_RETRY_ATTEMPTS, 1000)),
    ).toPromise();
  }
}
