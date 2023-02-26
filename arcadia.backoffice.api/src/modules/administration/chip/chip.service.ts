import { BadRequestException, Injectable } from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
import {
  ChipEntity,
  ChipRepository,
  ChipStatus,
  ChipTypeRepository,
  connectionNames,
  getRepositoryToken,
  In,
  Not,
  SiteRepository,
} from 'arcadia-dal';
import { from, interval, zip } from 'rxjs';
import { bufferCount, mergeMap, reduce } from 'rxjs/operators';
import {
  CHIP_NOT_FOUND,
  RFID_SERIALS_DOESNT_MATCH,
  WRONG_RFID_FORMAT,
  WRONG_RFID_RANGE,
  WRONG_SEARCH_RFID_TERM,
} from '../../../messages/messages';
import { DisqualifyChipDto, RegisterChipDto } from './chip.dto';
import {
  ChipsResponse,
  ChipTypesResponse,
  DisqualifyChipsResponse,
  ParsedFromToRfidsInterface,
} from './chip.interface';

@Injectable()
export class ChipService {
  constructor(
    private readonly moduleRef: ModuleRef,
  ) {
  }

  private static parseFromToRfids(data: { fromRFID: string; toRFID?: string }): ParsedFromToRfidsInterface {
    const parseRfidIndex = (RFID: string): number | null => {
      const match = RFID.match(/\d+$/);
      return match ? Number(match.pop()) : null;
    };

    const parsedFromRfid: ParsedFromToRfidsInterface = {
      from: {
        serial: data.fromRFID.replace(/\d+$/, ''),
        index: parseRfidIndex(data.fromRFID),
      },
    };

    if (data.toRFID) {
      parsedFromRfid.to = {
        serial: data.toRFID.replace(/\d+$/, ''),
        index: parseRfidIndex(data.toRFID),
      };
    }

    return parsedFromRfid;
  }

  public async registerChips(data: RegisterChipDto, contextId?: ContextId): Promise<ChipsResponse> {
    const chipRepository: ChipRepository = await this.moduleRef
      .resolve<ChipRepository>(getRepositoryToken(ChipRepository, connectionNames.DATA), contextId);
    const siteRepository: SiteRepository = await this.moduleRef
      .resolve<SiteRepository>(getRepositoryToken(SiteRepository, connectionNames.DATA), contextId);
    const chipTypeRepository: ChipTypeRepository = await this.moduleRef
      .resolve<ChipTypeRepository>(getRepositoryToken(ChipTypeRepository, connectionNames.DATA), contextId);

    const parsedRfids = ChipService.parseFromToRfids(data);

    if (parsedRfids.from.serial !== parsedRfids.to.serial) throw new BadRequestException(RFID_SERIALS_DOESNT_MATCH.en);

    if (typeof parsedRfids.from.index !== 'number' || typeof parsedRfids.to.index !== 'number') throw new BadRequestException(WRONG_RFID_FORMAT.en);

    if (parsedRfids.to.index < parsedRfids.from.index) throw new BadRequestException(WRONG_RFID_RANGE.en);

    const rfidSerial = parsedRfids.from.serial;

    const createdChips = new Map<string, ChipEntity>();
    const site = await siteRepository.findOne({ where: { id: data.siteId, isDeleted: false } });
    const chipType = await chipTypeRepository.findOne({ id: data.typeId, isDeleted: false });

    for (let i = parsedRfids.from.index; i <= parsedRfids.to.index; i += 1) {
      const rfid = `${rfidSerial}${i}`;

      const chip = chipRepository.create();

      chip.rfid = rfid;
      chip.value = data.value;
      chip.type = chipType;
      chip.site = site;

      chip.isDeleted = false;
      chip.status = ChipStatus.ACTIVE;

      createdChips.set(chip.rfid, chip);
    }

    const existingChips = await chipRepository.find({ rfid: In(Array.from(createdChips).map(([, c]) => c.rfid)) });
    existingChips.forEach(c => createdChips.delete(c.rfid));

    return zip(from(createdChips.values()).pipe(bufferCount(50)), interval(200))
      .pipe(mergeMap(zip => {
        const [chips] = zip;
        return (chipRepository.save(chips, { reload: false, transaction: false }));
      }),
      reduce((acc: ChipEntity[], chips: ChipEntity[]) => {
        acc.push(...chips);
        return acc;
      }, []),
      ).toPromise()
      .then(createdChips => ({
        total: createdChips.length,
        chips: createdChips.map(chip => ({
          rfid: chip.rfid,
          value: chip.value,
          typeId: chip.type.id,
          siteId: chip.site.id,
          status: chip.status,
        })),
      }));
  }

  public async disqualifyChips(data: DisqualifyChipDto, contextId: ContextId): Promise<DisqualifyChipsResponse> {
    const chipRepository: ChipRepository = await this.moduleRef
      .resolve<ChipRepository>(getRepositoryToken(ChipRepository, connectionNames.DATA), contextId);

    const parsedRfids = ChipService.parseFromToRfids(data);

    if (!parsedRfids.to) {
      const rfid = `${parsedRfids.from.serial}${parsedRfids.from.index}`;
      const chipToDisqualify = await chipRepository.findOne({ rfid });
      if (!chipToDisqualify) {
        throw new BadRequestException(CHIP_NOT_FOUND);
      }
      chipToDisqualify.status = ChipStatus.DISQUALIFIED;
      await chipRepository.save(chipToDisqualify);
      return { total: 1, rfids: [rfid] };
    }

    if (parsedRfids.from.serial !== parsedRfids.to.serial) throw new BadRequestException(RFID_SERIALS_DOESNT_MATCH.en);

    if (typeof parsedRfids.from.index !== 'number' || typeof parsedRfids.to.index !== 'number') throw new BadRequestException(WRONG_RFID_FORMAT.en);

    if (parsedRfids.to.index < parsedRfids.from.index) throw new BadRequestException(WRONG_RFID_RANGE.en);

    const rfidSerial = parsedRfids.from.serial;

    const rfidsArrayToDisqualify: string[] = [];

    for (let i = parsedRfids.from.index; i <= parsedRfids.to.index; i += 1) {
      rfidsArrayToDisqualify.push(`${rfidSerial}${i}`);
    }

    const chipsToDisqualify: ChipEntity[] = await chipRepository.find({
      rfid: In(rfidsArrayToDisqualify),
      status: Not(ChipStatus.DISQUALIFIED),
    });

    return zip(from(chipsToDisqualify).pipe(bufferCount(50)), interval(200))
      .pipe(mergeMap(async zip => {
        const [chips] = zip;
        return (chipRepository.save(chips.map(chip => {
          chip.status = ChipStatus.DISQUALIFIED;
          return chip;
        }), { reload: false, transaction: false }));
      }),
      reduce((acc: string[], value) => {
        acc.push(...(value.map(chip => chip.rfid)));
        return acc;
      }, []),
      ).toPromise()
      .then(value => ({
        total: value.length,
        rfids: value,
      }));
  }

  public async findChipsByRfidTerm(term: string, contextId: ContextId): Promise<ChipsResponse> {
    const chipRepository: ChipRepository = await this.moduleRef
      .resolve<ChipRepository>(getRepositoryToken(ChipRepository, connectionNames.DATA), contextId);
    if (!term) throw new BadRequestException(WRONG_SEARCH_RFID_TERM.en);

    const chips = await chipRepository.findChipsByRfidTerm(term);

    return {
      total: chips.length,
      chips,
    };
  }

  public async getChipTypes(contextId?: ContextId): Promise<ChipTypesResponse> {
    const chipTypeRepository: ChipTypeRepository = await this.moduleRef
      .resolve<ChipTypeRepository>(getRepositoryToken(ChipTypeRepository, connectionNames.DATA), contextId);
    const chipTypes = await chipTypeRepository.find({
      where: { isDeleted: false },
      select: ['id', 'name'],
    });

    return {
      total: chipTypes.length,
      chipTypes,
    };
  }
}
