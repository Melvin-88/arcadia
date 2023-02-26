export function shouldSendQueueBalance(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'createQueryBuilder').mockReturnValue({ innerJoin: () => ({ where: () => ({ getOne: () => Promise.resolve({ id: 2, name: '<name>' }) }) }) });
}