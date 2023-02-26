import { MachineStatus, QueueStatus } from 'arcadia-dal';

export function shouldThrowExceptionMachineNotFound(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'findOne').mockResolvedValue(null);
}

export function shouldThrowExceptionGroupNotFound(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'findOne').mockResolvedValue({});
    jest.spyOn(spyTargets.groupRepository, 'findOne').mockResolvedValue(null);
}

export function shouldThrowExceptionSameGroup(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'findOne').mockResolvedValue({ group: { id: 1 } });
    jest.spyOn(spyTargets.groupRepository, 'findOne').mockResolvedValue({});
}

export function shouldThrowExceptionMachineOffline(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'findOne').mockResolvedValue({ status: MachineStatus.OFFLINE, group: { id: 1 } });
    jest.spyOn(spyTargets.groupRepository, 'findOne').mockResolvedValue({});
}

export function shouldThrowExceptionChipIncompatible(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'findOne').mockResolvedValue({ group: { id: 1 }, chips: [{ type: 'a' }] });
    jest.spyOn(spyTargets.groupRepository, 'findOne').mockResolvedValue({});
    jest.spyOn(spyTargets.rngPrizeRepository, 'getAllPrizes').mockResolvedValue([{}]);
}

export function shouldReassignMachine(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'findOne').mockResolvedValue({ id: 1, group: { id: 2 }, queue: { status: QueueStatus.READY }, chips: [] });
    jest.spyOn(spyTargets.groupRepository, 'findOne').mockResolvedValue({ configuration: { rtpSegment: '<rtp>' } });
    jest.spyOn(spyTargets.rngPrizeRepository, 'getAllPrizes').mockResolvedValue([{ chipType: { id: 42 } }]);
}