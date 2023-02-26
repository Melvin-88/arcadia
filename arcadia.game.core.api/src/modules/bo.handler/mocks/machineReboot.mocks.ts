import { MachineStatus } from 'arcadia-dal';

export function shouldThrowExceptionMachineInPlay(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'findOneOrFail').mockResolvedValue({ id: 1, status: MachineStatus.IN_PLAY, group: { id: 2 }, });
}

export function shouldHardStopReboot(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'findOneOrFail').mockResolvedValue({ id: 1, serial: '<serial>', group: { id: 2 }, });
}
