import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ChipRepository,
  ChipStatus,
  connectionNames,
  Dispenser,
  In,
  InjectRepository,
  MachineEntity,
  MachineRepository,
} from 'arcadia-dal';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { MainAppInterceptor } from '../interceptors/app';
import { RegisterChipDto } from '../modules/administration/chip/chip.dto';
import { ChipsResponse, ChipTypesResponse } from '../modules/administration/chip/chip.interface';
import { ChipService } from '../modules/administration/chip/chip.service';
import { ConfigService } from '../modules/config/config.service';

@Controller({ path: 'chip-registration' })
@UseInterceptors(MainAppInterceptor)
export class AppController {
  private readonly filesPath: string = '/storage';

  constructor(
    @Inject(ChipService) private readonly chipService: ChipService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @InjectRepository(MachineRepository, connectionNames.DATA) private readonly machineRepository: MachineRepository,
    @InjectRepository(ChipRepository, connectionNames.DATA) private readonly chipRepository: ChipRepository,
  ) {
    this.filesPath = <string> this.configService.get(['core', 'ROBOT_DEMO_CHIP_PATH'], this.filesPath);
  }

  @Get('/')
  public async registerChips(@Query() data: any): Promise<any> {
    const machine: MachineEntity = await this.machineRepository.findOne({ serial: data.serial }, { relations: ['site'] });
    if (!machine) {
      throw new NotFoundException('serial not found');
    }
    if (!machine.configuration || !machine.configuration.dispensers) {
      throw new NotFoundException('Machine have no configuration');
    }

    const filePath = join(this.filesPath, `chips_${data.serial}.json`);
    if (existsSync(filePath)) {
      const chipsByDispenser: any = JSON.parse(readFileSync(filePath).toString('utf-8'));
      const chips: any[] = Object.values(chipsByDispenser).flat();
      if (chips.length === (await this.chipRepository.find({ rfid: In(chips) })).length) {
        this.chipRepository.update({ rfid: In(chips) }, {
          machine: () => 'null',
          status: ChipStatus.ACTIVE,
          site: machine.site,
        });
        return { status: 'ok' };
      }
      await this.chipRepository.delete({ rfid: In(chips) });
    }

    const types: ChipTypesResponse = await this.chipService.getChipTypes();
    if (types.total < 1) {
      throw new NotFoundException('Chip types not found');
    }

    const typesByName: Map<string, number> = types.chipTypes.reduce(
      (map, type) => {
        map.set(type.name, type.id);
        return map;
      },
      new Map());

    const robotEmuChips = {};
    // eslint-disable-next-line guard-for-in
    for (const dispenser in machine.configuration.dispensers) {
      const dispenserInfo: Dispenser = machine.configuration.dispensers[dispenser];

      // eslint-disable-next-line no-continue
      if (!typesByName.has(dispenserInfo.chipType)) continue;

      const rfId: string = `${machine.serial}${Math.random().toString(36).substring(3)}`.replace(/[^a-zA-Z]+/g, '');

      const chipsRegister: RegisterChipDto = {
        fromRFID: `${rfId}1`,
        toRFID: `${rfId}500`,
        typeId: typesByName.get(dispenserInfo.chipType),
        value: 20,
        siteId: machine.site.id,
        machineId: machine.id,
      };

      const chips: ChipsResponse = await this.chipService.registerChips(chipsRegister);
      robotEmuChips[dispenser] = chips.chips.map(chip => chip.rfid);
    }

    writeFileSync(filePath, JSON.stringify(robotEmuChips), { encoding: 'utf-8' });

    return { status: 'ok' };
  }
}
