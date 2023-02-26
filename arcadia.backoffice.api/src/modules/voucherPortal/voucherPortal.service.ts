import { BadRequestException, Injectable } from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
import {
  connectionNames,
  getRepositoryToken,
  GroupRepository,
  VoucherEntity,
  VoucherRepository,
  InjectRepository,
  PlayerRepository, OperatorEntity,
} from 'arcadia-dal';
import * as moment from 'moment';
import { StatisticsResponse } from './voucherPortal.interface';
import { VouchersService } from '../vouchers/vouchers.service';
import { VoucherResponse, VouchersResponse } from '../vouchers/vouchers.interface';
import { VoucherCreateDto } from './voucherCreate.dto';
import { EXPIRATION_DATE_IN_PAST, GROUP_NOT_FOUND, PLAYER_NOT_FOUND } from '../../messages/messages';

@Injectable()
export class VoucherPortalService {
  constructor(
      @InjectRepository(GroupRepository, connectionNames.DATA) private readonly groupRepository: GroupRepository,
      @InjectRepository(PlayerRepository, connectionNames.DATA) private readonly playerRepository: PlayerRepository,
      private readonly moduleRef: ModuleRef,
      private readonly vouchersService: VouchersService,
  ) {
  }

  public async getVouchers(filters: any, contextId: ContextId): Promise<VouchersResponse> {
    return this.vouchersService.getVouchers(filters, contextId);
  }

  public async getStatistics(operatorId: number, contextId: ContextId): Promise<StatisticsResponse> {
    const voucherRepository: VoucherRepository = await this.moduleRef
      .resolve<VoucherRepository>(getRepositoryToken(VoucherRepository, connectionNames.DATA), contextId);
    return voucherRepository.getVoucherPortalStats(operatorId);
  }

  public async createVoucher(data: VoucherCreateDto, operatorId: number, contextId: ContextId): Promise<VoucherResponse[]> {
    const voucherRepository: VoucherRepository = await this.moduleRef
      .resolve<VoucherRepository>(getRepositoryToken(VoucherRepository, connectionNames.DATA), contextId);

    if (moment(data.expirationDate).isBefore()) {
      throw new BadRequestException(EXPIRATION_DATE_IN_PAST.en);
    }

    const group = await this.groupRepository.findOne({ where: { name: data.groupName, isDeleted: false } });
    if (!group) {
      throw new BadRequestException(GROUP_NOT_FOUND.en);
    }
    const players = await this.playerRepository.findByIds(data.playerCid, { where: { isDeleted: false } });
    if (!players || players.length !== data.playerCid.length) {
      throw new BadRequestException(PLAYER_NOT_FOUND.en);
    }

    const voucherEntities: VoucherEntity[] = players.map(p => {
      const voucher = new VoucherEntity();
      voucher.group = group;
      voucher.operator = new OperatorEntity();
      voucher.operator.id = operatorId;
      voucher.expirationDate = data.expirationDate;
      voucher.player = p;
      return voucher;
    });

    await voucherRepository.save(voucherEntities);
    return voucherRepository.getVouchersById(voucherEntities.map(v => v.id));
  }

  public async revokeVoucher(id: number, reason: string, contextId: ContextId): Promise<VoucherResponse> {
    return this.vouchersService.revokeVoucher(id, reason, contextId);
  }
}