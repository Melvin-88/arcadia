import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
import {
  connectionNames,
  getRepositoryToken,
  GroupEntity,
  GroupRepository,
  GroupStatus,
  InjectRepository,
  RngChipPrizeRepository,
} from 'arcadia-dal';
import { v4 as uuidv4 } from 'uuid';
import {
  GROUP_ALREADY_EXISTS,
  GROUP_DELETED,
  GROUP_NOT_EMPTY,
  GROUP_NOT_FOUND,
  GROUP_NOT_OFFLINE,
} from '../../messages/messages';
import { GameCoreClientService } from '../game.core.client/game.core.client.service';
import { MyLogger } from '../logger/logger.service';
import { CreateGroupDto, EditGroupDto } from './dtos';
import {
  DenominatorValuesResponse,
  GroupIdResponse,
  GroupNamesResponse,
  GroupResponse,
  GroupsResponse,
  PrizeGroupsResponse,
} from './responses';

@Injectable()
export class GroupsService {
  constructor(
    private readonly logger: MyLogger,
    @InjectRepository(GroupRepository, connectionNames.DATA) private readonly groupRepository: GroupRepository,
    @InjectRepository(RngChipPrizeRepository, connectionNames.DATA) private readonly rngChipPrizeRepository: RngChipPrizeRepository,
    private readonly gameCoreClientService: GameCoreClientService,
    private readonly moduleRef: ModuleRef,
    private readonly coreClient: GameCoreClientService,
  ) {
  }

  public getGroups(filters: any): Promise<GroupsResponse> {
    return this.groupRepository.getAllGroups(filters);
  }

  public async getGroupNames(): Promise<GroupNamesResponse> {
    const groupsAndCount = await this.groupRepository.findAndCount();
    return {
      total: groupsAndCount[1],
      groups: groupsAndCount[0].map(g => ({
        name: g.name,
        id: g.id,
      })),
    };
  }

  public async getDenominatorValues(): Promise<DenominatorValuesResponse> {
    const denominators = await this.groupRepository.getUniqueDenominators();
    return {
      total: denominators.length,
      denominators,
    };
  }

  public async editGroup(id: number, data: EditGroupDto, contextId: ContextId): Promise<GroupResponse> {
    const groupRepository: GroupRepository = await this.moduleRef
      .resolve<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA), contextId);

    const group = await groupRepository.findOne(id);
    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND.en);
    }
    if (group.isDeleted) {
      throw new BadRequestException(GROUP_DELETED.en);
    }
    if (group.status !== GroupStatus.OFFLINE) {
      throw new NotAcceptableException(GROUP_NOT_OFFLINE.en);
    }

    group.name = data.name ? data.name : group.name;
    group.blueRibbonGameId = data.blueRibbonGameId !== undefined ? data.blueRibbonGameId : group.blueRibbonGameId;
    group.color = data.color !== undefined ? data.color : group.color;
    group.denominator = data.denominator ? data.denominator : group.denominator;
    group.stackBuyLimit = data.stackBuyLimit ? data.stackBuyLimit : group.stackBuyLimit;
    group.stackSize = data.stackCoinsSize ? data.stackCoinsSize : group.stackSize;
    group.isPrivate = data.isPrivate !== undefined ? data.isPrivate : group.isPrivate;
    group.idleTimeout = data.idleTimeout ? data.idleTimeout : group.idleTimeout;
    group.graceTimeout = data.graceTimeout ? data.graceTimeout : group.graceTimeout;
    group.regulation = data.regulation ? data.regulation : group.regulation;
    group.configuration = data.configuration ? data.configuration : group.configuration;
    group.prizeGroup = data.prizeGroup;

    await groupRepository.save(group);
    return groupRepository.getGroupById(id);
  }

  public async createGroup(data: CreateGroupDto, contextId: ContextId): Promise<GroupResponse> {
    const groupRepository: GroupRepository = await this.moduleRef
      .resolve<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA), contextId);

    const existingGroup = await groupRepository.findOne({ name: data.name, isDeleted: false });
    if (existingGroup) {
      throw new BadRequestException(GROUP_ALREADY_EXISTS.en);
    }

    const group = new GroupEntity();
    group.name = data.name;
    group.blueRibbonGameId = data.blueRibbonGameId;
    group.color = data.color;
    group.denominator = data.denominator;
    group.stackBuyLimit = data.stackBuyLimit;
    group.stackSize = data.stackCoinsSize;
    group.isPrivate = data.isPrivate;
    group.idleTimeout = data.idleTimeout;
    group.graceTimeout = data.graceTimeout;
    group.regulation = data.regulation ? data.regulation : {};
    group.configuration = data.configuration ? data.configuration : {};
    group.prizeGroup = data.prizeGroup;

    const createdGroup = await groupRepository.save(group);

    return this.groupRepository.getGroupById(createdGroup.id);
  }

  public async deleteGroup(id: string, contextId: ContextId): Promise<void> {
    const groupRepository: GroupRepository = await this.moduleRef
      .resolve<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA), contextId);

    const group = await groupRepository.findOne(id, { relations: ['machines'] });
    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND.en);
    }
    if (group.isDeleted) {
      throw new BadRequestException(GROUP_DELETED.en);
    }
    if (group.status !== GroupStatus.OFFLINE) {
      throw new BadRequestException(GROUP_NOT_OFFLINE.en);
    }
    if (group.machines.length > 0) {
      throw new BadRequestException(GROUP_NOT_EMPTY.en);
    }
    group.isDeleted = true;
    await groupRepository.save(group);
  }

  public async activateGroup(id: number, contextId: ContextId): Promise<GroupResponse> {
    const groupRepository: GroupRepository = await this.moduleRef
      .resolve<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA), contextId);

    const group = await groupRepository.findOne(id);
    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND.en);
    }
    if (group.isDeleted) {
      throw new BadRequestException(GROUP_DELETED.en);
    }
    if (group.status !== GroupStatus.OFFLINE) {
      throw new BadRequestException(GROUP_NOT_OFFLINE.en);
    }
    group.status = GroupStatus.IDLE;
    await groupRepository.save(group);

    return groupRepository.getGroupById(id);
    // TODO: Anything else?
  }

  public async dryGroup(groupId: number): Promise<GroupIdResponse> {
    const group = await this.groupRepository.findOne(groupId);
    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND.en);
    }
    if (group.isDeleted) {
      throw new BadRequestException(GROUP_DELETED.en);
    }
    const correlationId = uuidv4();
    this.logger.log(`Group soft stop: groupId: ${group.id}, correlationId: ${correlationId}`);
    await this.gameCoreClientService.groupSoftStop(group.id, correlationId);
    return { groupId };
  }

  public async shutdownGroup(groupId: number): Promise<GroupIdResponse> {
    const group = await this.groupRepository.findOne(groupId);
    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND.en);
    }
    if (group.isDeleted) {
      throw new BadRequestException(GROUP_DELETED.en);
    }
    const correlationId = uuidv4();
    this.logger.log(`Group shutdown: groupId=${groupId}, correlationId=${correlationId}`);
    await this.coreClient.groupHardStop(groupId, correlationId);
    return { groupId };
  }

  public async getPrizeGroups(): Promise<PrizeGroupsResponse> {
    const groups = await this.rngChipPrizeRepository.getAllPrizeGroups();
    return {
      total: groups.length,
      groups,
    };
  }
}
