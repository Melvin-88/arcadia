import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
import {
  connectionNames,
  getRepositoryToken,
  GroupRepository,
  LogoEntity,
  LogoRepository,
  OperatorEntity,
  OperatorRepository,
  OperatorStatus,
} from 'arcadia-dal';
import * as argon2 from 'argon2';
import {
  GROUP_NOT_FOUND,
  OPERATOR_ALREADY_EXISTS,
  OPERATOR_DELETED,
  OPERATOR_LOGO_NOT_FOUND,
  OPERATOR_NOT_DISABLED,
  OPERATOR_NOT_ENABLED,
  OPERATOR_NOT_FOUND,
} from '../../messages/messages';
import { ConfigService } from '../config/config.service';
import { CreateOperatorDto, EditOperatorDto } from './operators.dto';
import {
  OperatorLogoResponse,
  OperatorNamesResponse,
  OperatorResponse,
  OperatorsResponse,
} from './operators.interface';

@Injectable()
export class OperatorsService {
  constructor(
    private readonly config: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
  }

  public async getOperators(filters: any, contextId: ContextId): Promise<OperatorsResponse> {
    const operatorRepository: OperatorRepository = await this.moduleRef
      .resolve<OperatorRepository>(getRepositoryToken(OperatorRepository, connectionNames.DATA), contextId);
    const operatorsAndCountRaw = await operatorRepository.getAllOperators(filters);

    return {
      operators: operatorsAndCountRaw[0],
      total: operatorsAndCountRaw[1],
    };
  }

  public async getOperatorLogo(id: number, contextId: ContextId): Promise<Buffer> {
    const logoRepository: LogoRepository = await this.moduleRef
      .resolve<LogoRepository>(getRepositoryToken(LogoRepository, connectionNames.DATA), contextId);
    const logo = await logoRepository.findOne({ where: { id, isDeleted: false } });
    if (!logo) {
      throw new NotFoundException(OPERATOR_LOGO_NOT_FOUND.en);
    }

    return logo.logoBinary;
  }

  public async getOperatorNames(contextId: ContextId): Promise<OperatorNamesResponse> {
    const operatorRepository: OperatorRepository = await this.moduleRef
      .resolve<OperatorRepository>(getRepositoryToken(OperatorRepository, connectionNames.DATA), contextId);
    const operatorsAndCount = await operatorRepository.findAndCount({
      where: { isDeleted: false },
      order: { name: 'ASC' },
    });

    return {
      operators: operatorsAndCount[0].map(o => ({
        id: Number(o.id),
        name: o.name,
      })),
      total: operatorsAndCount[1],
    };
  }

  public async createOperator(data: CreateOperatorDto, contextId: ContextId): Promise<OperatorResponse> {
    const groupRepository: GroupRepository = await this.moduleRef
      .resolve<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA), contextId);
    const operatorRepository: OperatorRepository = await this.moduleRef
      .resolve<OperatorRepository>(getRepositoryToken(OperatorRepository, connectionNames.DATA), contextId);

    const existingOperator = await operatorRepository.findOne({
      name: data.name,
      isDeleted: false,
    });
    if (existingOperator) {
      throw new BadRequestException(OPERATOR_ALREADY_EXISTS.en);
    }

    const groups = await groupRepository.findByIds(data.linkToGroups, { isDeleted: false });
    if (groups.length !== data.linkToGroups.length) {
      throw new BadRequestException(GROUP_NOT_FOUND.en);
    }

    const operator = new OperatorEntity();
    operator.name = data.name;
    operator.apiConnectorId = data.apiConnectorId;
    operator.apiAccessToken = data.apiAccessToken;
    operator.apiTokenExpirationDate = data.apiTokenExpirationDate;
    operator.regulation = data.regulation;
    operator.logoUrl = data.logoUrl ? data.logoUrl : null;
    operator.blueRibbonId = data.blueRibbonOperatorId ? data.blueRibbonOperatorId : null;
    operator.configuration = data.configuration;
    operator.voucherPortalUsername = data.voucherPortalUsername;
    operator.voucherPortalPassword = await argon2.hash(data.voucherPortalPassword);
    if (groups?.length) {
      operator.groups = groups;
    }
    const createdOperator = await operatorRepository.save(operator, { transaction: false });
    return operatorRepository.getOperatorById(createdOperator.id);
  }

  public async editOperator(id: number, data: EditOperatorDto, contextId: ContextId): Promise<OperatorResponse> {
    const groupRepository: GroupRepository = await this.moduleRef
      .resolve<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA), contextId);
    const operatorRepository: OperatorRepository = await this.moduleRef
      .resolve<OperatorRepository>(getRepositoryToken(OperatorRepository, connectionNames.DATA), contextId);

    const operator = await operatorRepository.findOne(id, { relations: ['groups'] });
    if (!operator) {
      throw new NotFoundException(OPERATOR_NOT_FOUND.en);
    }
    if (operator.isDeleted) {
      throw new BadRequestException(OPERATOR_DELETED.en);
    }

    operator.name = data.name || operator.name;
    operator.apiConnectorId = data.apiConnectorId || operator.apiConnectorId;
    operator.apiAccessToken = data.apiAccessToken || operator.apiAccessToken;
    operator.apiTokenExpirationDate = data.apiTokenExpirationDate || operator.apiTokenExpirationDate;
    operator.regulation = data.regulation || operator.regulation;
    operator.logoUrl = data.logoUrl || operator.logoUrl;
    operator.blueRibbonId = data.blueRibbonOperatorId !== undefined ? data.blueRibbonOperatorId : operator.blueRibbonId;
    operator.configuration = data.configuration || operator.configuration;
    operator.voucherPortalUsername = data.voucherPortalUsername || operator.voucherPortalUsername;
    operator.voucherPortalPassword = data.voucherPortalPassword ? await argon2.hash(data.voucherPortalPassword) : operator.voucherPortalPassword;

    if (data.logoUrl === '') {
      operator.logoUrl = null;
    }
    if (data.linkToGroups !== undefined) {
      if (data.linkToGroups === null || data.linkToGroups.length === 0) {
        operator.groups = [];
      } else {
        const groups = await groupRepository.findByIds(data.linkToGroups, { isDeleted: false });
        if (groups.length !== data.linkToGroups.length) {
          throw new BadRequestException(GROUP_NOT_FOUND.en);
        }
        operator.groups = groups;
      }
    }
    await operatorRepository.save(operator, { transaction: false, reload: false });
    return operatorRepository.getOperatorById(id);
  }

  public async enableOperator(id: number, contextId: ContextId): Promise<OperatorResponse> {
    const operatorRepository: OperatorRepository = await this.moduleRef
      .resolve<OperatorRepository>(getRepositoryToken(OperatorRepository, connectionNames.DATA), contextId);

    const operator = await operatorRepository.findOne(id);
    if (!operator) {
      throw new NotFoundException(OPERATOR_NOT_FOUND.en);
    }
    if (operator.isDeleted) {
      throw new BadRequestException(OPERATOR_DELETED.en);
    }
    if (operator.status !== OperatorStatus.DISABLED) {
      throw new BadRequestException(OPERATOR_NOT_DISABLED.en);
    }
    operator.status = OperatorStatus.ENABLED;
    await operatorRepository.save(operator);
    return operatorRepository.getOperatorById(id);
  }

  public async disableOperator(id: number, contextId: ContextId): Promise<OperatorResponse> {
    const operatorRepository: OperatorRepository = await this.moduleRef
      .resolve<OperatorRepository>(getRepositoryToken(OperatorRepository, connectionNames.DATA), contextId);

    const operator = await operatorRepository.findOne(id);
    if (!operator) {
      throw new NotFoundException(OPERATOR_NOT_FOUND.en);
    }
    if (operator.isDeleted) {
      throw new BadRequestException(OPERATOR_DELETED.en);
    }
    if (operator.status !== OperatorStatus.ENABLED) {
      throw new BadRequestException(OPERATOR_NOT_ENABLED.en);
    }
    operator.status = OperatorStatus.DISABLED;
    // TODO: Terminate all active sessions
    await operatorRepository.save(operator);
    return operatorRepository.getOperatorById(id);
  }

  public async removeOperator(id: number, contextId: ContextId): Promise<void> {
    const operatorRepository: OperatorRepository = await this.moduleRef
      .resolve<OperatorRepository>(getRepositoryToken(OperatorRepository, connectionNames.DATA), contextId);

    const operator = await operatorRepository.findOne(id);
    if (!operator) {
      throw new NotFoundException(OPERATOR_NOT_FOUND.en);
    }
    if (operator.isDeleted) {
      throw new BadRequestException(OPERATOR_DELETED.en);
    }
    operator.isDeleted = true;
    await operatorRepository.save(operator);
  }

  public async uploadLogo(logoBinary: Buffer, contextId: ContextId): Promise<OperatorLogoResponse> {
    const logoRepository: LogoRepository = await this.moduleRef
      .resolve<LogoRepository>(getRepositoryToken(LogoRepository, connectionNames.DATA), contextId);
    const logo = new LogoEntity();
    logo.logoBinary = logoBinary;

    await logoRepository.save(logo);
    const url = `https://${this.config.get(['core', 'BO_API_DOMAIN']) as string}/api/operators/logo?id=${logo.id}`;
    return {
      id: logo.id,
      url,
    };
  }
}
