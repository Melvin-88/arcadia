export const engageNextSessionMock = {
  id: 2, roundsLeft: 10, player: { cid: '<cid>' }, group: { operator: { id: 12 } },
};

export function shouldStopNoMoreSessions(spyTargets: any): void {
  jest.spyOn(spyTargets.queueManager, 'getNextSession').mockResolvedValue(null);
  jest.spyOn(spyTargets.sessionRepository, 'find').mockResolvedValue([{ id: 1 }, { id: 2 }]);
}

export function shouldNotEngageEmptySession(spyTargets: any): void {
  jest.spyOn(spyTargets.queueManager, 'getNextSession').mockResolvedValue({ id: 2, roundsLeft: 0 });
  jest.spyOn(spyTargets.sessionRepository, 'find').mockResolvedValue([{ id: 1 }, { id: 2 }]);
}

export function shouldSkipFromBuy(spyTargets: any): void {
  jest.spyOn(spyTargets.queueManager, 'getNextSession').mockResolvedValue(engageNextSessionMock);
  jest.spyOn(spyTargets.sessionRepository, 'find').mockResolvedValue([{ id: 1 }, { id: 2 }]);
}

export function shouldArchiveNoFundsAvailable(spyTargets: any): void {
  jest.spyOn(spyTargets.queueManager, 'getNextSession').mockResolvedValue(engageNextSessionMock);
  jest.spyOn(spyTargets.sessionRepository, 'find').mockResolvedValue([{ id: 1 }, { id: 2 }]);
  jest.spyOn(spyTargets.operatorClient, 'wager').mockResolvedValue(null);
}

export function shouldAllowIfFromBuy(spyTargets: any): void {
  jest.spyOn(spyTargets.queueManager, 'getNextSession').mockResolvedValue({ ...engageNextSessionMock, totalStacksUsed: 20 });
  jest.spyOn(spyTargets.sessionRepository, 'find').mockResolvedValue([{ id: 1 }, { id: 2 }]);
  jest.spyOn(spyTargets.roundService, 'createRound').mockResolvedValue({ coins: 10 });
  jest.spyOn(spyTargets.operatorClient, 'wager').mockReturnValue({
    toPromise: () => Promise.resolve({}),
  });
}

export function shouldEngageFromInitial(spyTargets: any): void {
  jest.spyOn(spyTargets.queueManager, 'getNextSession').mockResolvedValue({ ...engageNextSessionMock, totalStacksUsed: 0 });
  jest.spyOn(spyTargets.sessionRepository, 'find').mockResolvedValue([{ id: 1 }, { id: 2 }]);
  jest.spyOn(spyTargets.roundService, 'createRound').mockResolvedValue({ coins: 10 });
  jest.spyOn(spyTargets.operatorClient, 'wager').mockReturnValue({
    toPromise: () => Promise.resolve({}),
  });
}