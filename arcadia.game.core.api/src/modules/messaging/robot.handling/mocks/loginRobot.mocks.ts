export const loginRobotMachineMock = {
  id: 1,
  serial: '<serial>',
};

export function shouldReturnLoginData(spyTargets: any): void {
  jest.spyOn(spyTargets.machineRepository, 'findOne').mockResolvedValue(loginRobotMachineMock);
  jest.spyOn(spyTargets.queueRepository, 'getFreeQueue').mockResolvedValue(undefined);
}