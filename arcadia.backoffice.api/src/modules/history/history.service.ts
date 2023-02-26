import { BadRequestException, Injectable, NotImplementedException } from '@nestjs/common';
import {
  AlertRepository, AuditAction,
  ChangeRepository,
  connectionNames,
  DisputeRepository,
  GroupRepository,
  InjectRepository,
  MachineRepository,
  OperatorRepository,
  PerformanceIndicatorRepository,
  PlayerRepository,
  SessionArchiveRepository,
  SessionRepository,
  UserRepository,
  VoucherRepository,
} from 'arcadia-dal';
import { EntitiesHistoryResponse } from './history.interface';
import { UNKNOWN_ENTITY } from '../../messages/messages';
import { intToIp } from '../../helpers/intToIp';
import { getObjectDiffs } from '../../helpers/objectDiff';
import { HistoryEntities } from './enums/history.entities';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(UserRepository, connectionNames.DATA) private readonly userRepository: UserRepository,
    @InjectRepository(ChangeRepository, connectionNames.AUDIT) private readonly changeRepository: ChangeRepository,
    @InjectRepository(AlertRepository, connectionNames.DATA) private readonly alertRepository: AlertRepository,
    @InjectRepository(DisputeRepository, connectionNames.DATA) private readonly disputeRepository: DisputeRepository,
    @InjectRepository(GroupRepository, connectionNames.DATA) private readonly groupRepository: GroupRepository,
    @InjectRepository(MachineRepository, connectionNames.DATA) private readonly machineRepository: MachineRepository,
    @InjectRepository(PerformanceIndicatorRepository, connectionNames.DATA) private readonly monitoringRepository: PerformanceIndicatorRepository,
    @InjectRepository(OperatorRepository, connectionNames.DATA) private readonly operatorRepository: OperatorRepository,
    @InjectRepository(PlayerRepository, connectionNames.DATA) private readonly playerRepository: PlayerRepository,
    @InjectRepository(SessionRepository, connectionNames.DATA) private readonly sessionRepository: SessionRepository,
    @InjectRepository(SessionArchiveRepository, connectionNames.DATA) private readonly sessionArchiveRepository: SessionArchiveRepository,
    @InjectRepository(VoucherRepository, connectionNames.DATA) private readonly voucherRepository: VoucherRepository,
  ) {}

  public async getEntityHistory(filters: any, tableName: string, id?: any): Promise<EntitiesHistoryResponse> {
    switch (tableName) {
      case HistoryEntities.ALERTS:
        return this.getEntityHistoryAbstract(filters, this.alertRepository.metadata.tableName, id);
      case HistoryEntities.DISPUTES:
        return this.getDisputesHistory(filters, id);
      case HistoryEntities.GROUPS:
        return this.getEntityHistoryAbstract(filters, this.groupRepository.metadata.tableName, id);
      case HistoryEntities.MACHINES:
        return this.getEntityHistoryAbstract(filters, this.machineRepository.metadata.tableName, id);
      case HistoryEntities.MONITORING:
        return this.getEntityHistoryAbstract(filters, this.monitoringRepository.metadata.tableName, id);
      case HistoryEntities.OPERATORS:
        return this.getEntityHistoryAbstract(filters, this.operatorRepository.metadata.tableName, id);
      case HistoryEntities.VOUCHERS:
        return this.getEntityHistoryAbstract(filters, this.voucherRepository.metadata.tableName, id);
      case HistoryEntities.CAMERAS:
        throw new NotImplementedException('Cameras history is not available');
      case HistoryEntities.MAINTENANCE:
        return this.getEntityHistoryAbstract(filters, this.alertRepository.metadata.tableName, id);
      case HistoryEntities.ADMINISTRATION:
        return this.getEntityHistoryAbstract(filters, this.userRepository.metadata.tableName, id);
      case HistoryEntities.PLAYERS:
        if (id) {
          filters.cid = id;
        }
        return this.getEntityHistoryAbstract(filters, this.playerRepository.metadata.tableName, id);
      case HistoryEntities.SESSIONS:
        return this.getSessionsHistory(filters, id);
      default:
        throw new BadRequestException(UNKNOWN_ENTITY.en);
    }
  }

  private async getDisputesHistory(filters: any, id?: any): Promise<EntitiesHistoryResponse> {
    const historyData = await this.getEntityHistoryAbstract(filters, this.disputeRepository.metadata.tableName, id);
    historyData.history.forEach(h => {
      if (h.previousData?.session?.playerIP) {
        h.previousData.session.playerIP = intToIp(Buffer.from(h.previousData.session.playerIP.data).readInt32BE(0));
      }
      if (h.newData?.session?.playerIP) {
        h.newData.session.playerIP = intToIp(Buffer.from(h.newData.session.playerIP.data).readInt32BE(0));
      }
      if (h.previousData?.operator?.logoBinary) {
        delete h.previousData.operator.logoBinary;
      }
      if (h.newData?.operator?.logoBinary) {
        delete h.newData.operator.logoBinary;
      }
    });
    return historyData;
  }

  private async getSessionsHistory(filters: any, id?: any): Promise<EntitiesHistoryResponse> {
    const historyData = await this.getEntityHistoryAbstract(filters, this.sessionRepository.metadata.tableName, id);
    const historyDataArchive = await this.getEntityHistoryAbstract(filters, this.sessionArchiveRepository.metadata.tableName, id);
    historyData.history.concat(historyDataArchive.history);

    historyData.history.forEach(h => {
      if (h.previousData?.playerIP) {
        h.previousData.playerIP = intToIp(Buffer.from(h.previousData.playerIP.data).readInt32BE(0));
      }
      if (h.newData?.playerIP) {
        h.newData.playerIP = intToIp(Buffer.from(h.newData.playerIP.data).readInt32BE(0));
      }
    });
    return historyData;
  }

  private async getEntityHistoryAbstract(filters: any, tableName: string, id: any): Promise<EntitiesHistoryResponse> {
    filters.entity = tableName;
    if (id && !filters.cid) {
      try {
        filters.id = parseInt(id, 10);
      } catch (e) {
        filters.id = id;
      }
    }
    const historyAndCountRaw = await this.changeRepository.getAllChanges(filters);
    return {
      total: historyAndCountRaw[1],
      history: historyAndCountRaw[0].map(h => {
        const objectDiff = h.actionType === AuditAction.UPDATE ? getObjectDiffs(h.oldEntity, h.newEntity) : null;
        const previousData = objectDiff ? objectDiff.aOld : h.oldEntity;
        const newData = objectDiff ? objectDiff.bNew : h.newEntity;

        const historyData = {
          date: h.createDate,
          action: h.actionType,
          user: {
            name: h.action.userName,
            email: h.action.userEmail,
            id: h.action.userId,
          },
          previousData,
          newData,
        };

        if (historyData.previousData?.password) {
          delete historyData.previousData.password;
        }
        if (historyData.newData?.password) {
          delete historyData.newData.password;
        }

        return historyData;
      }),
    };
  }
}