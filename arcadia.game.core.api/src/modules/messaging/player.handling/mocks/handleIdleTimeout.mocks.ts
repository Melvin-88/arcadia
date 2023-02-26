export const handleIdleTimeoutSessionMock = {
  id: 1,
  player: { cid: '<cid>' },
  machine: { serial: '<serial>' },
  group: { operator: {} },
  isDisconnected: false,
  offeredQueueId: 32,
  queue: { id: 32 },
  configuration: { autoplay: {} },
};

export function shouldStartAutoplay(spyTargets: any): void {
  // @ts-ignore
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockResolvedValue(handleIdleTimeoutSessionMock);
}