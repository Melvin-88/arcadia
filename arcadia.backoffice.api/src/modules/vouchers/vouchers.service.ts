import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  connectionNames,
  getRepositoryToken,
  VoucherRepository,
  VoucherStatus,
} from 'arcadia-dal';
import { ContextId, ModuleRef } from '@nestjs/core';
import { VoucherResponse, VouchersResponse } from './vouchers.interface';
import { VOUCHER_BOUND_TO_SESSION, VOUCHER_NOT_FOUND, VOUCHER_NOT_PENDING } from '../../messages/messages';

@Injectable()
export class VouchersService {
  constructor(
        private readonly moduleRef: ModuleRef,
  ) {}

  public async getVouchers(filters: any, contextId: ContextId): Promise<VouchersResponse> {
    const voucherRepository: VoucherRepository = await this.moduleRef
      .resolve<VoucherRepository>(getRepositoryToken(VoucherRepository, connectionNames.DATA), contextId);
    const vouchersAndCountRaw = await voucherRepository.getAllVouchers(filters);
    return {
      vouchers: vouchersAndCountRaw[0],
      total: vouchersAndCountRaw[1],
    };
  }

  public async revokeVoucher(id: number, reason: string, contextId: ContextId): Promise<VoucherResponse> {
    const voucherRepository: VoucherRepository = await this.moduleRef
      .resolve<VoucherRepository>(getRepositoryToken(VoucherRepository, connectionNames.DATA), contextId);
    const voucher = await voucherRepository.findOne({ where: { id }, relations: ['session'] });
    if (!voucher) {
      throw new NotFoundException(VOUCHER_NOT_FOUND.en);
    }
    if (voucher.status !== VoucherStatus.PENDING) {
      throw new BadRequestException(VOUCHER_NOT_PENDING.en);
    }
    if (voucher.session) {
      throw new BadRequestException(VOUCHER_BOUND_TO_SESSION.en);
    }
    voucher.status = VoucherStatus.REVOKED;
    voucher.revocationReason = reason;
    await voucherRepository.save(voucher);
    return voucherRepository.getVoucherById(voucher.id);
  }
}
