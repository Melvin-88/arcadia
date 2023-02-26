import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  connectionNames,
  DisputeEntity,
  DisputeRepository,
  getRepositoryToken,
  InjectRepository,
  OperatorEntity,
  OperatorRepository,
  PlayerEntity,
  PlayerRepository,
  DisputeStatus,
  CurrencyConversionRepository,
  SessionArchiveRepository,
  SessionArchiveEntity,
} from 'arcadia-dal';
import { ContextId, ModuleRef } from '@nestjs/core';
import { DisputeResponse, DisputesResponse } from './disputes.interface';
import { CreateDisputeDto, UpdateDisputeDto } from './disputes.dto';
import {
  DISPUTE_NOT_FOUND,
  OPERATOR_NOT_FOUND,
  PLAYER_NOT_FOUND,
  SESSION_NOT_FOUND,
} from '../../messages/messages';

@Injectable()
export class DisputesService {
  constructor(
      @InjectRepository(SessionArchiveRepository, connectionNames.DATA) private readonly sessionArchiveRepository: SessionArchiveRepository,
      @InjectRepository(PlayerRepository, connectionNames.DATA) private readonly playerRepository: PlayerRepository,
      @InjectRepository(OperatorRepository, connectionNames.DATA) private readonly operatorRepository: OperatorRepository,
      private readonly moduleRef: ModuleRef,
  ) {
  }

  private async getDisputeRepository(connectionName: string, contextId: ContextId): Promise<DisputeRepository> {
    return this.moduleRef.resolve<DisputeRepository>(getRepositoryToken(DisputeRepository, connectionName), contextId);
  }

  public async getDisputes(filters: any, contextId: ContextId): Promise<DisputesResponse> {
    const disputeRepository: DisputeRepository = await this.getDisputeRepository(connectionNames.DATA, contextId);
    const disputesAndCountRaw = await disputeRepository.getAllDisputes(filters);
    return {
      disputes: disputesAndCountRaw[0],
      total: disputesAndCountRaw[1],
    };
  }

  public async getRebateCurrencies(contextId: ContextId): Promise<string[]> {
    const currencyConversionRepository = await this.moduleRef
      .resolve<CurrencyConversionRepository>(getRepositoryToken(CurrencyConversionRepository, connectionNames.DATA), contextId);

    const currencies = await currencyConversionRepository.find({ where: { isDeleted: false }, select: ['currency'] });
    return currencies.map(c => c.currency);
  }

  public async createDispute(data: CreateDisputeDto, contextId: ContextId): Promise<DisputeResponse> {
    const disputeRepository: DisputeRepository = await this.getDisputeRepository(connectionNames.DATA, contextId);
    const dispute: DisputeEntity = new DisputeEntity();

    if ((data.rebateSum || data.rebateCurrency) && !(data.rebateSum && data.rebateCurrency)) {
      throw new BadRequestException('Rebate sum must be provided along with currency');
    }

    const [
      operator,
      player,
      session,
    ] = await Promise.all([
      data.operatorId ? this.operatorRepository.findOne(data.operatorId) : null,
      data.playerCid ? this.playerRepository.findOne(data.playerCid) : null,
      data.sessionId ? this.sessionArchiveRepository.findOne(data.sessionId) : null,
    ]);

    if (data.operatorId && !operator) {
      throw new NotFoundException(OPERATOR_NOT_FOUND.en);
    }

    if (data.playerCid && !player) {
      throw new NotFoundException(PLAYER_NOT_FOUND.en);
    }

    if (data.sessionId && !session) {
      throw new NotFoundException(SESSION_NOT_FOUND.en);
    }

    dispute.operator = operator;

    dispute.player = player;

    dispute.session = session;

    dispute.status = data.status;
    dispute.rebateSum = data.rebateSum;
    dispute.rebateCurrency = data.rebateCurrency;
    dispute.complaint = data.complaint;
    dispute.discussion = data.discussion;

    await disputeRepository.save(dispute);
    const createdDispute = await disputeRepository.getDisputeById(dispute.id);

    return {
      id: createdDispute.id,
      status: createdDispute.status,
      operatorName: createdDispute.operatorName,
      operatorId: createdDispute.operatorId,
      playerCid: createdDispute.playerCid,
      sessionId: createdDispute.sessionId,
      rebateSum: createdDispute.rebateSum,
      rebateCurrency: createdDispute.rebateCurrency,
      openedAtDate: createdDispute.openedAtDate,
      closedAtDate: createdDispute.closedAtDate,
      complaint: createdDispute.complaint,
      discussion: createdDispute.discussion,
    };
  }

  public async updateDispute(disputeId: number, data: UpdateDisputeDto, contextId: ContextId): Promise<DisputeResponse> {
    const disputeRepository: DisputeRepository = await this.getDisputeRepository(connectionNames.DATA, contextId);
    const dispute: DisputeEntity = await disputeRepository.findOne({ where: { id: disputeId, isDeleted: false } });

    if (!dispute) {
      throw new NotFoundException(DISPUTE_NOT_FOUND.en);
    }

    if (data.operatorId) {
      const operator: OperatorEntity = await this.operatorRepository.findOne({ id: data.operatorId, isDeleted: false });
      if (!operator) {
        throw new NotFoundException(OPERATOR_NOT_FOUND.en);
      }

      dispute.operator = new OperatorEntity();
      dispute.operator.id = data.operatorId;
    }

    if (data.playerCid !== undefined) {
      if (data.playerCid === null) {
        dispute.player = null;
      } else {
        const player: PlayerEntity = await this.playerRepository.findOne({ where: { cid: data.playerCid, isDeleted: false } });
        if (!player) {
          throw new NotFoundException(PLAYER_NOT_FOUND.en);
        }

        dispute.player = new PlayerEntity();
        dispute.player.cid = data.playerCid;
      }
    }

    if (data.sessionId !== undefined) {
      if (data.sessionId === null) {
        dispute.session = null;
      } else {
        const session: SessionArchiveEntity = await this.sessionArchiveRepository.findOne({ id: data.sessionId });
        if (!session) {
          throw new NotFoundException(SESSION_NOT_FOUND.en);
        }

        dispute.session = new SessionArchiveEntity();
        dispute.session.id = data.sessionId;
      }
    }

    data.status && (dispute.status = data.status);
    if (data.status === DisputeStatus.CLOSED) dispute.closedDate = new Date();

    dispute.rebateSum = data.rebateSum !== undefined ? data.rebateSum : dispute.rebateSum;
    dispute.rebateCurrency = data.rebateCurrency !== undefined ? data.rebateCurrency : dispute.rebateCurrency;
    data.complaint && (dispute.complaint = data.complaint);
    dispute.discussion = data.discussion !== undefined ? data.discussion : dispute.discussion;

    if ((dispute.rebateSum || dispute.rebateCurrency) && !(dispute.rebateSum && dispute.rebateCurrency)) {
      throw new BadRequestException('Rebate sum must be provided along with currency');
    }

    dispute.updateDate = new Date();

    await disputeRepository.save(dispute);

    const updatedDispute = await disputeRepository.getDisputeById(dispute.id);

    return {
      id: updatedDispute.id,
      status: updatedDispute.status,
      operatorName: updatedDispute.operatorName,
      operatorId: updatedDispute.operatorId,
      playerCid: updatedDispute.playerCid,
      sessionId: updatedDispute.sessionId,
      rebateSum: updatedDispute.rebateSum,
      rebateCurrency: updatedDispute.rebateCurrency,
      openedAtDate: updatedDispute.openedAtDate,
      closedAtDate: updatedDispute.closedAtDate,
      complaint: updatedDispute.complaint,
      discussion: updatedDispute.discussion,
    };
  }
}
