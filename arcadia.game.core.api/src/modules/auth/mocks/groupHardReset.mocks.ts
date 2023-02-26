export function shouldReturnGroupIdSuccess(spyTargets: any): void {
  // @ts-ignore
  jest.spyOn(spyTargets.machineRepository, 'find').mockReturnValue(Promise.resolve([{
    id: 1,
    sessions: [
      {
        id: 1,
      },
    ],
    configuration: {
      wheelAnimationDuration: 1,
    },
  }]));
}

export function shouldReturnGroupIdNoMachines(spyTargets: any): void {
  jest.spyOn(spyTargets.machineRepository, 'find').mockReturnValue(Promise.resolve(null));
}