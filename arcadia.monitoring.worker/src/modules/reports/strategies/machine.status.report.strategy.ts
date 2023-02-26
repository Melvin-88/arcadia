/* eslint-disable max-lines */
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  concatMap,
  toArray,
} from 'rxjs/operators';
import * as _ from 'lodash';
import * as objectHash from 'object-hash';
import * as moment from 'moment';
import {
  connectionNames,
  DeleteResult,
  omitReportParams,
  InjectRepository,
  MachineStatusReportRepository,
  MachineStatusReportEntity,
  MachineStatusHistoryReportStreamInterface,
  MachineStatusHistoryRepository,
  MachineStatus,
  MachineRepository,
  MachineStatusReportGroupingKeys,
} from 'arcadia-dal';
import { Observable } from 'rxjs';
import { AbstractReportStrategy } from './abstract.report.strategy';

@Injectable()
export class MachineStatusReportStrategy extends AbstractReportStrategy {
  constructor(
    @InjectRepository(MachineStatusReportRepository, connectionNames.DATA)
    private readonly machineStatusReportRepository: MachineStatusReportRepository,
    @InjectRepository(MachineStatusHistoryRepository, connectionNames.DATA)
    private readonly machineStatusHistoryRepository: MachineStatusHistoryRepository,
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepository: MachineRepository,
  ) {
    super();
  }

  public async processData(payload: any): Promise<void> {
    const stream = await this.getDataStream(payload);

    const params = omitReportParams(payload.params);
    const paramsHash = objectHash(params);

    const [
      allMachinesWithStatuses,
      lastMachineStatuses,
    ] = await Promise.all([
      this.machineRepository.getExistingMachinesWithStatuses(payload.params),
      this.machineStatusHistoryRepository.getLastMachinesStatuses(payload.params.startDate),
    ]);

    const machines = Object.keys(lastMachineStatuses).reduce((accumulator, machineId) => {
      if (accumulator[machineId]) {
        accumulator[machineId].status = lastMachineStatuses[machineId].status;
        accumulator[machineId].timestamp = lastMachineStatuses[machineId].timestamp;
      }

      return accumulator;
    }, allMachinesWithStatuses);

    return stream.pipe(concatMap(async ({ day, dailyData }) => {
      Object.keys(machines).forEach(machineId => {
        const machine = dailyData.find(machine => +machine.machine === +machineId);

        if (!machine) {
          dailyData.push({
            id: machineId,
            timestamp: moment(day).startOf('day').toDate(),
            ...machines[machineId].info,
            day,
            month: moment(day).format('MM/YYYY'),
          });
        }
      });

      const groupedData: Record<string, MachineStatusHistoryReportStreamInterface[]> = _.groupBy(dailyData, item => item[payload.params.groupBy]);

      const entities = Object.entries(groupedData).reduce((accumulator: Partial<MachineStatusReportEntity>[], [groupingValue, data]) => {
        const machineIds = data.map(item => item.machine.toString());

        const metrics = data.reduce((accumulator: {
            totalAvailableTime: number,
            totalInPlayTime: number,
            totalErrorTime: number,
            totalOfflineTime: number,
            totalStoppedTime: number,
            totalShuttingDownTime: number,
            totalPreparingTime: number,
            totalReadyTime: number,
            totalSeedingTime: number,
            totalOnHoldTime: number,
          }, currentMachineRecord, index) => {
          const lastMachineRecord = machines[currentMachineRecord.machine];

          if (lastMachineRecord) {
            let timePassed: number;

            if (payload.params.groupBy === MachineStatusReportGroupingKeys.STATUS && lastMachineRecord.status !== currentMachineRecord.status) {
              lastMachineRecord.timestamp = moment(currentMachineRecord.timestamp).subtract(1, 'day').toDate();
            }

            if (moment(lastMachineRecord.timestamp).isBefore(moment(currentMachineRecord.timestamp).startOf('day'))) {
              timePassed = moment(currentMachineRecord.timestamp).diff(moment(currentMachineRecord.timestamp).startOf('day'), 'seconds');
            } else {
              timePassed = moment(currentMachineRecord.timestamp).diff(lastMachineRecord.timestamp, 'seconds');
            }

            if (machineIds.lastIndexOf(currentMachineRecord.machine.toString()) === index) {
              const additional = moment(currentMachineRecord.timestamp).endOf('day').diff(currentMachineRecord.timestamp, 'seconds') + 1;

              switch (currentMachineRecord.status) {
                case MachineStatus.IN_PLAY: {
                  accumulator.totalInPlayTime += additional;
                  accumulator.totalAvailableTime += additional;
                  break;
                }
                case MachineStatus.ERROR: {
                  accumulator.totalErrorTime += additional;
                  break;
                }
                case MachineStatus.OFFLINE: {
                  accumulator.totalOfflineTime += additional;
                  break;
                }
                case MachineStatus.STOPPED: {
                  accumulator.totalStoppedTime += additional;
                  accumulator.totalAvailableTime += additional;
                  break;
                }
                case MachineStatus.SHUTTING_DOWN: {
                  accumulator.totalShuttingDownTime += additional;
                  accumulator.totalAvailableTime += additional;
                  break;
                }
                case MachineStatus.PREPARING: {
                  accumulator.totalPreparingTime += additional;
                  accumulator.totalAvailableTime += additional;
                  break;
                }
                case MachineStatus.READY: {
                  accumulator.totalReadyTime += additional;
                  accumulator.totalAvailableTime += additional;
                  break;
                }
                case MachineStatus.SEEDING: {
                  accumulator.totalSeedingTime += additional;
                  accumulator.totalAvailableTime += additional;
                  break;
                }
                case MachineStatus.ON_HOLD: {
                  accumulator.totalOnHoldTime += additional;
                  accumulator.totalAvailableTime += additional;
                  break;
                }
                default: {
                  break;
                }
              }
            }

            switch (lastMachineRecord.status) {
              case MachineStatus.IN_PLAY: {
                accumulator.totalInPlayTime += timePassed;
                accumulator.totalAvailableTime += timePassed;
                break;
              }
              case MachineStatus.ERROR: {
                accumulator.totalErrorTime += timePassed;
                break;
              }
              case MachineStatus.OFFLINE: {
                accumulator.totalOfflineTime += timePassed;
                break;
              }
              case MachineStatus.STOPPED: {
                accumulator.totalStoppedTime += timePassed;
                accumulator.totalAvailableTime += timePassed;
                break;
              }
              case MachineStatus.SHUTTING_DOWN: {
                accumulator.totalShuttingDownTime += timePassed;
                accumulator.totalAvailableTime += timePassed;
                break;
              }
              case MachineStatus.PREPARING: {
                accumulator.totalPreparingTime += timePassed;
                accumulator.totalAvailableTime += timePassed;
                break;
              }
              case MachineStatus.READY: {
                accumulator.totalReadyTime += timePassed;
                accumulator.totalAvailableTime += timePassed;
                break;
              }
              case MachineStatus.SEEDING: {
                accumulator.totalSeedingTime += timePassed;
                accumulator.totalAvailableTime += timePassed;
                break;
              }
              case MachineStatus.ON_HOLD: {
                accumulator.totalOnHoldTime += timePassed;
                accumulator.totalAvailableTime += timePassed;
                break;
              }
              default: {
                break;
              }
            }
          }

          allMachinesWithStatuses[currentMachineRecord.machine].status = currentMachineRecord.status;
          allMachinesWithStatuses[currentMachineRecord.machine].timestamp = currentMachineRecord.timestamp;

          return accumulator;
        }, {
          totalAvailableTime: 0,
          totalInPlayTime: 0,
          totalErrorTime: 0,
          totalOfflineTime: 0,
          totalStoppedTime: 0,
          totalShuttingDownTime: 0,
          totalPreparingTime: 0,
          totalReadyTime: 0,
          totalSeedingTime: 0,
          totalOnHoldTime: 0,
        });

        const readyReportItem: Partial<MachineStatusReportEntity> = {
          date: day,
          groupingKey: payload.params.groupBy,
          groupingValue,
          params,
          paramsHash,
          isCompleted: !moment(data[0].day).isSameOrAfter(moment().startOf('day')),
          totalMachines: Object.keys(allMachinesWithStatuses).length,
          totalAvailableTime: metrics.totalAvailableTime,
          totalInPlayTime: metrics.totalInPlayTime,
          totalErrorTime: metrics.totalErrorTime,
          totalOfflineTime: metrics.totalOfflineTime,
          totalStoppedTime: metrics.totalStoppedTime,
          totalShuttingDownTime: metrics.totalShuttingDownTime,
          totalOnHoldTime: metrics.totalOnHoldTime,
          totalPreparingTime: metrics.totalPreparingTime,
          totalReadyTime: metrics.totalReadyTime,
          totalSeedingTime: metrics.totalSeedingTime,
        };

        accumulator.push(readyReportItem);

        return accumulator;
      }, []);

      try {
        await this.machineStatusReportRepository.save(entities, { transaction: true });
      } catch (e) {
        throw new InternalServerErrorException('Failed to save day');
      }

      return day;
    }),
    toArray(),
    concatMap(async createdDays => {
      const leftDays = _.difference(payload.daysToCreate, createdDays);

      const entities = leftDays.map((date): Partial<MachineStatusReportEntity> => ({
        date,
        groupingKey: payload.params.groupBy,
        groupingValue: null,
        params,
        paramsHash,
        totalMachines: 0,
        totalAvailableTime: 0,
        totalInPlayTime: 0,
        totalErrorTime: 0,
        totalOfflineTime: 0,
        totalStoppedTime: 0,
        totalShuttingDownTime: 0,
        totalOnHoldTime: 0,
        totalPreparingTime: 0,
        totalReadyTime: 0,
        totalSeedingTime: 0,
        isCompleted: !moment(date).isSameOrAfter(moment().startOf('day')),
      }));

      await this.machineStatusReportRepository.save(entities);
    },
    ))
      .toPromise();
  }

  public removeEmptyRecords(paramsHash: string): Promise<DeleteResult> {
    return this.machineStatusReportRepository.delete({ paramsHash, groupingKey: null });
  }

  protected getDataStream(payload: any): Promise<Observable<{ day: string, dailyData: MachineStatusHistoryReportStreamInterface[] }>> {
    return this.machineStatusHistoryRepository.getMachineStatusHistoryReportStream(payload);
  }
}
