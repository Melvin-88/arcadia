import { MachineStatus } from 'arcadia-dal';

export function shouldThrowExceptionMachineCannotStart(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'findOneOrFail').mockResolvedValue({ status: MachineStatus.READY });
}

export function shouldUpdateMachineSendRun(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'findOneOrFail').mockResolvedValue({ status: MachineStatus.OFFLINE, id: 1, serial: '<serial>' });
}