/* eslint-disable max-lines */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
import {
  ChipRepository,
  connectionNames,
  getRepositoryToken,
  GroupRepository,
  InjectRepository,
  MachineEntity,
  MachinePowerLine,
  MachineRepository,
  MachineStatus,
  QueueEntity,
  QueueRepository,
  QueueStatus,
  SiteRepository,
} from 'arcadia-dal';
import { v4 as uuidv4 } from 'uuid';
import {
  FAILED_TO_START_MACHINE,
  GROUP_NOT_FOUND_NAME,
  MACHINE_ALREADY_EXISTS,
  MACHINE_DELETED,
  MACHINE_IP_NOT_UNIQUE,
  MACHINE_NOT_FOUND,
  MACHINE_NOT_OFFLINE,
  SITE_NOT_FOUND_NAME,
} from '../../messages/messages';
import { GameCoreClientService } from '../game.core.client/game.core.client.service';
import { MyLogger } from '../logger/logger.service';
import { ActivateMachineDto } from './dtos/activate.machine.dto';
import { CreateMachineDto } from './dtos/create.machine.dto';
import { EditMachineDto } from './dtos/edit.machine.dto';
import { ReassignMachineDto } from './dtos/reassign.machine.dto';
import {
  MachineIdResponse,
  MachineNamesResponse,
  MachineResponse,
  MachinesResponse,
  PowerLinesResponse,
  SitesResponse,
} from './responses';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepository: MachineRepository,
    @InjectRepository(ChipRepository, connectionNames.DATA)
    private readonly chipRepository: ChipRepository,
    private readonly moduleRef: ModuleRef,
    private readonly gameCoreClientService: GameCoreClientService,
    private readonly logger: MyLogger,
  ) {
  }

  public async getMachines(filters: any): Promise<MachinesResponse> {
    const machinesAndCountRaw = await this.machineRepository.getAllMachines(filters);

    const machines: MachineResponse[] = machinesAndCountRaw[0].map(m => ({
      id: m.id,
      status: m.status,
      name: m.name,
      groupName: m.groupName,
      viewers: m.viewers,
      inQueue: m.inQueue,
      uptime: m.uptime,
      serial: m.serial,
      cameraID: m.cameraID,
      controllerIP: m.controllerIP,
      siteName: m.siteName,
      location: m.location,
      lastDiagnosticDate: m.lastDiagnosticDate,
      configuration: m.configuration,
      chipsOnTable: {},
      queueStatus: m.queueStatus || QueueStatus.STOPPED,
      powerLine: m.powerLine,
    }));

    const chipPromises = machines.map(async m => m.chipsOnTable = await this.chipRepository.findChipsByMachineId(m.id));
    await Promise.all(chipPromises);

    return {
      total: machinesAndCountRaw[1],
      machines,
    };
  }

  public async getMachineNames(): Promise<MachineNamesResponse> {
    const machinesAndCount = await this.machineRepository.findAndCount({ where: { isDeleted: false } });

    return {
      machines: machinesAndCount[0].map(m => ({
        id: m.id,
        name: m.name,
      })),
      total: machinesAndCount[1],
    };
  }

  public async getSites(contextId: ContextId): Promise<SitesResponse> {
    const siteRepository: SiteRepository = await this.moduleRef
      .resolve<SiteRepository>(getRepositoryToken(SiteRepository, connectionNames.DATA), contextId);
    const sitesAndCount = await siteRepository.findAndCount({ where: { isDeleted: false } });
    return {
      sites: sitesAndCount[0].map(s => ({
        id: s.id,
        name: s.name,
      })),
      total: sitesAndCount[1],
    };
  }

  public async editMachine(id: number, data: EditMachineDto, contextId: ContextId): Promise<MachineResponse> {
    const machineRepository: MachineRepository = await this.moduleRef
      .resolve<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA), contextId);
    const groupRepository: GroupRepository = await this.moduleRef
      .resolve<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA), contextId);
    const siteRepository: SiteRepository = await this.moduleRef
      .resolve<SiteRepository>(getRepositoryToken(SiteRepository, connectionNames.DATA), contextId);

    const machine = await machineRepository.findOne(id);
    if (!machine) {
      throw new NotFoundException(MACHINE_NOT_FOUND.en);
    }
    if (machine.isDeleted) {
      throw new BadRequestException(MACHINE_DELETED.en);
    }
    if (machine.status !== MachineStatus.OFFLINE) {
      throw new BadRequestException(MACHINE_NOT_OFFLINE.en);
    }
    const ipNotUnique = await machineRepository.createQueryBuilder('machine')
      .where('machine.controller_ip = INET6_ATON(:ip)', { ip: data.controllerIP })
      .andWhere('machine.id <> :id', { id: machine.id })
      .getCount();
    if (ipNotUnique) {
      throw new BadRequestException(MACHINE_IP_NOT_UNIQUE.en);
    }
    machine.name = data.name ? data.name : machine.name;
    machine.serial = data.serial ? data.serial : machine.serial;
    machine.cameraID = data.cameraID ? data.cameraID : machine.cameraID;
    machine.controllerIP = data.controllerIP ? () => `INET6_ATON('${data.controllerIP}')` : machine.controllerIP;
    machine.location = data.location ? data.location : machine.location;
    machine.configuration = data.configuration ? data.configuration : machine.configuration;
    machine.powerLine = data.powerLine;

    if (data.groupName) {
      const group = await groupRepository.findOne({ name: data.groupName, isDeleted: false });
      if (!group) {
        throw new BadRequestException(GROUP_NOT_FOUND_NAME.en);
      }
      machine.group = group;
    }
    if (data.siteName) {
      const site = await siteRepository.findOne({
        where: {
          name: data.siteName,
          isDeleted: false,
        },
      });
      if (!site) {
        throw new BadRequestException(SITE_NOT_FOUND_NAME.en);
      }
      machine.site = site;
    }
    await machineRepository.save(machine);
    const updatedMachine = await machineRepository.getMachineById(id);
    return {
      id: updatedMachine.id,
      status: updatedMachine.status,
      name: updatedMachine.name,
      groupName: updatedMachine.groupName,
      viewers: updatedMachine.viewers,
      inQueue: updatedMachine.inQueue,
      uptime: updatedMachine.uptime,
      serial: updatedMachine.serial,
      cameraID: updatedMachine.cameraID,
      controllerIP: updatedMachine.controllerIP,
      siteName: updatedMachine.siteName,
      location: updatedMachine.location,
      lastDiagnosticDate: updatedMachine.lastDiagnosticDate,
      chipsOnTable: {}, // TODO: ???
      configuration: updatedMachine.configuration,
      queueStatus: updatedMachine.queueStatus,
      powerLine: updatedMachine.powerLine,
    };
  }

  public async createMachine(data: CreateMachineDto, contextId: ContextId): Promise<MachineResponse> {
    const machineRepository: MachineRepository = await this.moduleRef
      .resolve<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA), contextId);
    const queueRepository: QueueRepository = await this.moduleRef
      .resolve<QueueRepository>(getRepositoryToken(QueueRepository, connectionNames.DATA), contextId);
    const siteRepository: SiteRepository = await this.moduleRef
      .resolve<SiteRepository>(getRepositoryToken(SiteRepository, connectionNames.DATA), contextId);
    const groupRepository: GroupRepository = await this.moduleRef
      .resolve<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA), contextId);

    const existingMachine = await machineRepository.findOne({
      serial: data.serial,
      name: data.name,
      isDeleted: false,
    });
    if (existingMachine) {
      throw new BadRequestException(MACHINE_ALREADY_EXISTS.en);
    }
    const ipNotUnique = await machineRepository.createQueryBuilder('machine')
      .where('machine.controller_ip = INET6_ATON(:ip)', { ip: data.controllerIP }).getCount();
    if (ipNotUnique) {
      throw new BadRequestException(MACHINE_IP_NOT_UNIQUE.en);
    }

    const machine = new MachineEntity();
    machine.name = data.name;
    machine.serial = data.serial;
    machine.status = MachineStatus.OFFLINE;
    machine.cameraID = data.cameraID ? data.cameraID : machine.cameraID;
    machine.controllerIP = data.controllerIP ? () => `INET6_ATON('${data.controllerIP}')` : machine.controllerIP;
    machine.location = data.location ? data.location : machine.location;
    machine.configuration = data.configuration ? data.configuration : machine.configuration;
    machine.powerLine = data.powerLine;

    machine.queue = new QueueEntity();
    machine.queue.status = QueueStatus.STOPPED;

    if (data.groupName) {
      const group = await groupRepository.findOne({ name: data.groupName, isDeleted: false });
      if (!group) {
        throw new BadRequestException(GROUP_NOT_FOUND_NAME.en);
      }
      machine.group = group;
    }
    if (data.siteName) {
      const site = await siteRepository.findOne({
        where: {
          name: data.siteName,
          isDeleted: false,
        },
      });
      if (!site) {
        throw new BadRequestException(SITE_NOT_FOUND_NAME.en);
      }
      machine.site = site;
    }

    const createdMachine = await machineRepository.save(machine);

    const queue = new QueueEntity();

    queue.status = QueueStatus.STOPPED;
    queue.machine = createdMachine;

    await queueRepository.save(queue, { transaction: false, reload: false });

    const updatedMachine = await this.machineRepository.getMachineById(createdMachine.id);

    return {
      id: updatedMachine.id,
      status: updatedMachine.status,
      name: updatedMachine.name,
      groupName: updatedMachine.groupName,
      viewers: updatedMachine.viewers,
      inQueue: updatedMachine.inQueue,
      uptime: updatedMachine.uptime,
      serial: updatedMachine.serial,
      cameraID: updatedMachine.cameraID,
      controllerIP: updatedMachine.controllerIP,
      siteName: updatedMachine.siteName,
      location: updatedMachine.location,
      lastDiagnosticDate: updatedMachine.lastDiagnosticDate,
      chipsOnTable: {}, // TODO: ???
      configuration: updatedMachine.configuration,
      queueStatus: updatedMachine.queueStatus,
      powerLine: updatedMachine.powerLine,
    };
  }

  public async deleteMachine(id: number, contextId: ContextId): Promise<void> {
    const machineRepository: MachineRepository = await this.moduleRef
      .resolve<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA), contextId);

    const machine = await machineRepository.findOne(id);
    if (!machine) {
      throw new NotFoundException(MACHINE_NOT_FOUND.en);
    }
    if (machine.isDeleted) {
      throw new BadRequestException(MACHINE_DELETED.en);
    }
    if (machine.status !== MachineStatus.OFFLINE) {
      throw new BadRequestException(MACHINE_NOT_OFFLINE.en);
    }
    machine.isDeleted = true;
    await machineRepository.save(machine);
  }

  public async activateMachine(id: number, data: ActivateMachineDto): Promise<MachineIdResponse> {
    const machine = await this.machineRepository.getMachineById(id);
    if (!machine) {
      throw new NotFoundException(MACHINE_NOT_FOUND.en);
    }
    if (machine.isDeleted) {
      throw new BadRequestException(MACHINE_DELETED.en);
    }

    const correlationId = uuidv4();

    this.logger.log(`Starting machine: ${JSON.stringify(id)}, correlationId=${correlationId}`);

    try {
      const { machineId } = (await this.gameCoreClientService.startMachine(id, data, correlationId));

      return { machineId };
    } catch (e) {
      throw new HttpException(e.message || FAILED_TO_START_MACHINE.en, e.response?.status || HttpStatus.BAD_GATEWAY);
    }
  }

  public async reassignMachine(machineId: number, data: ReassignMachineDto): Promise<ReassignMachineDto> {
    const correlationId = uuidv4();
    this.logger.log(`Machine reassign request: machineId=${machineId}, toGroup=${data.groupId}, correlationId=${correlationId}`);
    return this.gameCoreClientService.reassignMachine(machineId, data, correlationId);
  }

  public async rebootMachine(machineId: number): Promise<MachineIdResponse> {
    const machine = await this.machineRepository.findOne(machineId);
    if (!machine) {
      throw new NotFoundException(MACHINE_NOT_FOUND.en);
    }
    if (machine.isDeleted) {
      throw new BadRequestException(MACHINE_DELETED.en);
    }
    const correlationId = uuidv4();
    this.logger.log(`Machine reboot: machineId=${machineId}, correlationId=${correlationId}`);
    await this.gameCoreClientService.machineReboot(machineId, correlationId);
    return { machineId };
  }

  public async dryMachine(machineId: number): Promise<MachineIdResponse> {
    const machine = await this.machineRepository.findOne(machineId, { relations: ['group'] });
    if (!machine) {
      throw new NotFoundException(MACHINE_NOT_FOUND.en);
    }
    if (machine.isDeleted) {
      throw new BadRequestException(MACHINE_DELETED.en);
    }
    const correlationId = uuidv4();
    this.logger.log(`Machine soft stop: machineId: ${machineId}, correlationId: ${correlationId}`);
    await this.gameCoreClientService
      .groupSoftStop(machine.group.id, correlationId, [machine.id]);
    return { machineId };
  }

  public async shutdownMachine(machineId: number): Promise<MachineIdResponse> {
    const machine = await this.machineRepository.findOne(machineId, { relations: ['group'] });
    if (!machine) {
      throw new NotFoundException(MACHINE_NOT_FOUND.en);
    }
    if (machine.isDeleted) {
      throw new BadRequestException(MACHINE_DELETED.en);
    }
    const correlationId = uuidv4();
    this.logger.log(`Machine shutdown: machineId=${machineId}, correlationId=${correlationId}`);
    await this.gameCoreClientService.groupHardStop(machine.group.id, correlationId, [machine.id]);
    return { machineId };
  }

  public getMachinePowerLines(): PowerLinesResponse {
    const values = Object.values(MachinePowerLine);
    return {
      total: values.length,
      powerLines: values.map(value => ({ name: value })),
    };
  }
}
