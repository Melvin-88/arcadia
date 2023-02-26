import { ChipStatus } from '../enums';

export interface ChipInterface {
    rfid: string;
    typeId: number;
    value: number;
    siteId: number;
    status: ChipStatus;
}